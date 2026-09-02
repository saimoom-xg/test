# Ecommerce Feature Specification — Addendum A

This addendum extends the base **Ecommerce Feature Specification** with additional modules identified during review. Section numbers continue from the base document (which ends at §9). Cross-references to base sections (e.g. §3.3, §3.4) refer to the original document.

---

## A.1 Returns and RMA (extends §3.3 Orders and Payments)

Refunds alone do not model a return. A return is a buyer-initiated request for a physical or state change (item back to seller) that *may* result in a refund, replacement, or store credit. Model it as its own workflow with its own status machine, separate from `order.status` and `payment.status`.

### Data model addition
```text
Return
  belongs to Order, OrderItem, User
  fields: reason_code, reason_note, requested_action (refund | replacement | store_credit),
          status, admin_note, restocking_fee, requested_at, resolved_at
  has one Refund (optional, created when requested_action = refund)
ReturnStatusHistory
  belongs to Return
  fields: actor, previous_status, new_status, note, timestamp
ReturnShipment
  belongs to Return
  fields: carrier, tracking_number, label_url, direction (buyer_to_seller), status
```

### Return status lifecycle
`requested → approved → awaiting_item → item_received → inspected → resolved (refunded | replaced | credited) → closed`
Alternate terminal state: `rejected` (with required admin_note).

### Rules
- Eligibility window: configurable number of days from delivery date (per product or store-wide default); enforce server-side at request time, not just in UI.
- A return request references specific `order_item` lines and quantities, not the whole order — partial returns must be supported.
- Return label generation is optional per shipping provider; if unsupported, buyer ships at own cost and provides tracking manually.
- Restocking fee (if any) is a signed decimal field, applied before refund calculation, and shown to the buyer before they confirm the request.
- Inventory is only restored at `item_received` + `inspected` (pass), never at `requested` — do not trust an unreturned item back into sellable stock.
- Refund record created under this flow must reuse the same `Refund` model as admin-initiated refunds (§ Order Cancellation workflow in base §6) — do not fork a second refund path.
- Reason codes should be a fixed enum (defective, wrong item, not as described, no longer wanted, damaged in transit, other) for reporting purposes — free text alone breaks the returns report.

### Routes
```text
/user/orders/{order}/returns/new     buyer, owner-only
/user/returns/{return}               buyer, owner-only
/admin/returns                       administrator, list + filter by status/reason
/admin/returns/{return}               administrator, approve/reject/resolve
```

### Acceptance criteria
- [ ] Buyer can request a return for eligible items only (within window, not already returned).
- [ ] Admin approval is required before a return is marked resolved.
- [ ] Inventory restoration only occurs after item receipt and inspection, never on request alone.
- [ ] Return status and refund status are tracked independently but linked.
- [ ] Reports (§3.10) can filter by return reason code.

---

## A.2 Order Invoice / Receipt Generation (extends §3.3, §3.7)

### Requirements
- Generate a PDF invoice per order, available to both buyer (`/user/orders/{order}/invoice`) and admin (`/admin/orders/{order}/invoice`).
- Invoice must be generated from the **immutable order-item snapshot** (base §3.3), never re-derived from current product/price data — an invoice for an order from six months ago must render identically today even if prices or product names changed since.
- Required invoice fields: legal seller name and address (configurable in admin settings), buyer billing name/address, order number, order date, line items (name, SKU, variant, unit price, qty, line total), subtotal, discount, tax (broken out by rate if more than one tax applies), shipping, grand total, currency code, payment method, payment status.
- If the target market has legal invoice-numbering requirements (sequential, non-reusable invoice numbers, common in EU/India/etc.), use a separate `invoice_number` sequence distinct from the internal order ID, generated once and immutable.
- Credit notes: when a return (§A.1) or refund reduces an order's total, generate a corresponding **credit note** PDF referencing the original invoice number — do not mutate or regenerate the original invoice.
- Invoices should be queued/generated asynchronously on order-paid transition and cached (stored file, not regenerated on every view) for performance and audit consistency.

### Data model addition
```text
Invoice
  belongs to Order
  fields: invoice_number (unique, sequential), issued_at, file_path, currency, totals snapshot (jsonb or duplicated columns)
CreditNote
  belongs to Invoice, Return (optional), Refund (optional)
  fields: credit_note_number, issued_at, amount, file_path
```

### Acceptance criteria
- [ ] Invoice PDF matches order snapshot exactly, independent of later catalog changes.
- [ ] Invoice numbers are sequential and never reused, even if an order is later cancelled.
- [ ] Buyer can only download invoices for their own orders.
- [ ] Credit notes reference their originating invoice and return/refund.

---

## A.3 Contact-Us (new module)

A structured contact channel separate from order-specific support, plus an order-context variant.

### Requirements
- Public contact form: name, email, subject, message, optional order number reference, optional file attachment.
- Rate-limited and CAPTCHA-protected (reuse §3.11 reCAPTCHA integration) to prevent spam.
- Submissions stored server-side (not email-only) so admins have a searchable record, and routed to a configured support inbox.
- Order-context contact: when a buyer opens contact from within an order detail page, auto-attach `order_id` and restrict to that buyer's own orders (ownership check, per base §3.7).
- Admin inbox view: list, filter by status (`new`, `open`, `resolved`), assign to admin user, internal notes, reply (queued email).
- Auto-acknowledgement email sent to the buyer on submission.

### Data model addition
```text
ContactMessage
  optionally belongs to User, Order
  fields: name, email, subject, message, attachment_path, status, assigned_admin_id, created_at
ContactMessageReply
  belongs to ContactMessage
  fields: actor, body, sent_at
```

### Routes
```text
/contact                       public
/user/orders/{order}/contact   buyer, owner-only, pre-fills order context
/admin/contact-messages        administrator
```

### Acceptance criteria
- [ ] Anonymous submission is rate-limited and CAPTCHA-verified.
- [ ] Order-linked contact messages are restricted to the order's owner.
- [ ] Admin can reply and status updates are recorded with a timestamp and actor.

---

## A.4 Coupon Module — Expanded Detail (extends base §3.4)

The base spec lists coupon fields at a high level. This expands the validation and application logic into an explicit, testable sequence, since coupon logic is one of the most common sources of pricing bugs.

### Full field set
```text
Coupon
  code (unique, case-insensitive, normalized on save and on lookup)
  type: fixed_amount | percentage
  value (decimal)
  min_order_amount (decimal, nullable)
  max_discount_amount (decimal, nullable — caps percentage discounts)
  starts_at, ends_at (nullable = no bound)
  usage_limit_total (nullable)
  usage_limit_per_user (nullable)
  is_active (boolean)
  applies_to: all_products | specific_categories | specific_products (recommended addition)
  stacking_policy: stackable | exclusive (recommended addition — define whether it can combine with flash sales, §A.5)
```

### Validation sequence (server-side, every step — never trust client-calculated discount)
1. Normalize submitted code (trim, uppercase/lowercase per your convention).
2. Look up coupon; reject unknown codes with a generic "invalid or expired code" message (do not leak whether a code exists but is expired vs. never existed — minor but real enumeration hardening).
3. Check `is_active`, `starts_at`/`ends_at` against current server time (never client time).
4. Check cart subtotal ≥ `min_order_amount`.
5. Check `usage_limit_total` against `CouponUsage` count.
6. Check `usage_limit_per_user` against the authenticated buyer's `CouponUsage` count (guest checkout: key by verified email + order history, documented as a known limitation if guests aren't deduplicated).
7. If `applies_to` is scoped, filter the discount base to only eligible line items — do not discount the whole cart if the coupon is category-restricted.
8. Compute discount using decimal arithmetic (§A.6): `percentage` type discount is capped by `max_discount_amount` if set.
9. Store the *computed discount amount* on the cart/order — never re-trust a client-submitted discount value at order creation.
10. **Recheck all of the above at order-creation time**, not just at cart-apply time — the cart may be stale (coupon could expire, hit its usage cap from another session, etc. between apply and checkout).
11. Record `CouponUsage` (coupon_id, user_id, order_id, discount_amount) only after the order reaches its configured success boundary (base §6 Coupon Application step 6) — a pending/failed order must not consume usage allowance.

### Acceptance criteria
- [ ] Coupon discount is always recalculated server-side at checkout, never trusted from client state.
- [ ] Expired/invalid code responses do not distinguish "doesn't exist" from "expired" in the user-facing message.
- [ ] Per-user usage limit is enforced even under concurrent checkout attempts (use a DB-level unique/locking check, not just an application-level count).
- [ ] Coupon usage is recorded only after successful order completion, and a failed payment does not consume the buyer's usage allowance.

---

## A.5 Flash Sale Module — Expanded Detail (extends base §3.4)

### Full field set
```text
FlashSale
  name, status (draft | scheduled | active | ended)
  starts_at, ends_at
FlashSaleProduct
  belongs to FlashSale, Product (or ProductVariant)
  sale_price OR discount_percentage (pick one mode per sale item)
  stock_limit (nullable — unlimited if null)
  sold_count (authoritative counter, see below)
```

### Active-sale resolution
- "Active" is computed as `status = active AND now() BETWEEN starts_at AND ends_at AND (stock_limit IS NULL OR sold_count < stock_limit)` — compute this at read time via a query/service, not a cached boolean flag that can drift.
- If a product is in more than one active flash sale simultaneously, define and document a single resolution rule (e.g. "lowest resulting price wins") — do not leave this undefined, it's a common concurrency-adjacent bug source.

### Concurrency-safe stock/sold_count updates
This is the "one authoritative stock update path" requirement from base §3.5 made concrete for flash sales:
- Use a single DB transaction with a row-level lock (`SELECT ... FOR UPDATE` or equivalent) or an atomic conditional update (`UPDATE flash_sale_products SET sold_count = sold_count + :qty WHERE id = :id AND sold_count + :qty <= stock_limit`) when decrementing flash-sale stock at order creation.
- The same code path must be used whether the purchase originates from the storefront cart, a re-checkout retry, or an admin-created order — no parallel/duplicate decrement logic.
- If the atomic update affects 0 rows (sale sold out between cart-add and checkout), fail the specific line item with a clear "this item's flash sale just sold out" message and let the buyer proceed with the remaining cart at regular price, rather than failing the whole checkout silently.

### Interaction with coupons
- Document explicitly whether flash-sale prices can also receive coupon discounts (see `stacking_policy` in §A.4). Recommended default: flash-sale price is treated as the new base price, and only `stackable` coupons apply on top of it.

### Acceptance criteria
- [ ] Active flash-sale lookup is computed from current time and remaining stock, not a stale cached flag.
- [ ] Sold-count increments use a single atomic/locking update path shared by all order-creation entry points.
- [ ] Concurrent checkouts on the last unit of limited flash-sale stock never oversell (verified by a concurrency test, not just code review).
- [ ] Coupon-and-flash-sale stacking behavior is explicitly defined and tested.

---

## A.6 Decimal-for-Money — Formal Policy (elevates base §4 note to a binding rule)

This was mentioned once in the base spec's data model notes; it's promoted here to an explicit, project-wide rule because money bugs are expensive and easy to reintroduce piecemeal.

### Rules
- **Never use `float`/`double` for any monetary value**, anywhere in the schema, application code, API payloads, or third-party integration mapping — prices, costs, discounts, tax amounts, shipping, totals, refund amounts, exchange rates, all of it.
- Database: use `DECIMAL(precision, scale)` (e.g. `DECIMAL(12,2)` for major-currency amounts; increase scale if the target market needs sub-cent precision or zero-decimal currencies like JPY — define per-currency `decimal_places` in the `Currency` table rather than hardcoding 2).
- Application layer: use a fixed-point/decimal type (e.g. `BigDecimal`, `decimal.Decimal`, a dedicated Money library) — never parse a price into a native float and do arithmetic on it, even "just for display."
- API/JSON payloads: serialize monetary amounts as strings (`"19.99"`) or as integer minor units (`1999` cents), not as JSON numbers, to avoid float round-tripping in clients that auto-parse JSON numbers as floats (notably JavaScript).
- Currency conversion: store the **exchange rate used at the time of an order** on the order itself (not just a live reference to the current `Currency.exchange_rate`), so historical orders don't recompute differently after a rate update.
- Rounding: define one rounding rule (e.g. round-half-up to the currency's minor unit) and apply it consistently at the point discounts/tax are finalized — not at display time, and not independently in three different places.
- Tests: include unit tests specifically asserting no floating-point drift across repeated discount/tax calculations (e.g. applying a 15% discount to $19.99 a thousand times should not drift the total).

### Acceptance criteria
- [ ] No `float`/`double` column or variable type is used for any money-related field in the codebase.
- [ ] All money fields carry an explicit currency reference, not an assumed global currency.
- [ ] Exchange rate at time of purchase is stored on the order, not derived from the live currency table.
- [ ] A single rounding function is used for all discount/tax/total calculations.

---

## A.7 Related / Cross-Sell / Upsell Products (extends base §3.1)

### Requirements
- Support at least three distinct relationship types, since "related products" conflates several different UX/business intents:
  - **Related** — same category/attributes, shown as general browsing suggestions.
  - **Cross-sell** — shown in cart/checkout ("frequently bought together," complementary items).
  - **Upsell** — shown on product detail page (higher-tier/alternative version of the same product).
- Two supported sourcing modes:
  - **Manual**: admin explicitly links Product A → [Product B, Product C, ...] per relationship type.
  - **Automatic** ("frequently bought together"): derived from historical `order_items` co-occurrence within the same order, recomputed periodically (batch job), not calculated live on every page load.
- Manual links take precedence over automatic suggestions when both exist for the same product/type.
- Respect product status — never surface a related/upsell link to an unpublished, out-of-stock (configurable), or deleted product.

### Data model addition
```text
ProductRelation
  belongs to Product (source), Product (related)
  fields: relation_type (related | cross_sell | upsell), sort_order, source (manual | auto)
```

### Placement
- Related: product detail page, "You may also like" section.
- Cross-sell: cart page and/or checkout page, before payment step.
- Upsell: product detail page, near price/add-to-cart.

### Acceptance criteria
- [ ] Each relationship type is stored and queried independently — cross-sell suggestions do not leak into the "related" section.
- [ ] Automatic "frequently bought together" suggestions are computed by a scheduled job, not a live per-request aggregate query.
- [ ] Suggestions never surface unpublished or deleted products.

---

## A.8 Abandoned Cart Recovery (extends base §3.2)

### Requirements
- Define "abandoned" precisely: a cart (guest session or authenticated) with ≥1 item, no completed order, and no cart activity for a configurable threshold (e.g. 60 minutes) — document the threshold in admin settings, don't hardcode it.
- For authenticated buyers with a known, verified email: trigger a queued recovery email sequence (e.g. reminder at 1 hour, follow-up at 24 hours, optional final nudge at 72 hours — configurable count/timing).
- For guest carts: only trigger recovery email if an email address was captured at some point in the flow (e.g. entered at checkout start but not completed) — never require account creation just to enable this feature, and never email an address that wasn't explicitly provided for this purpose.
- Recovery email must link to a cart-restoration URL that reconstructs the cart with **current** prices/stock (revalidate, per base §3.2 rule of re-validating stock before order creation) — never resurrect stale prices as binding.
- Stop the recovery sequence immediately once the cart converts to an order, or the buyer unsubscribes from marketing email, or the cart is manually emptied.
- Respect consent/privacy rules (base §3.11, §A note on privacy) — abandoned-cart email is marketing-adjacent; check it against the target market's consent requirements (e.g. some jurisdictions require opt-in, not just opt-out, for this category of email).

### Data model addition
```text
Cart
  add: last_activity_at, recovery_email (nullable, captured explicitly), recovery_stage, recovered_at (nullable)
CartRecoveryEvent
  belongs to Cart
  fields: stage, sent_at, opened_at (nullable), clicked_at (nullable)
```

### Acceptance criteria
- [ ] Abandonment threshold is configurable, not hardcoded.
- [ ] No recovery email is sent to an address that wasn't explicitly captured for that purpose.
- [ ] Recovery sequence halts on conversion, unsubscribe, or manual cart clear.
- [ ] Restored cart revalidates price and stock rather than trusting the original snapshot.

---

## A.9 Search Engine Selection (extends base §3.1)

The base spec lists "search, filtering, sorting" without naming an engine. Plain SQL `LIKE`/full-text search is adequate only up to roughly a few hundred to low thousands of SKUs with simple filters; beyond that, or with faceted filtering (price range + category + attribute + brand simultaneously), a dedicated search engine is recommended.

### Options (choose one, document the choice explicitly in the target project — don't leave it implicit)

| Engine | Fit | Notes |
|---|---|---|
| **Database full-text search** (Postgres `tsvector`/`GIN`, MySQL FULLTEXT) | Small catalogs (<~1–2k SKUs), simple keyword search, no faceting complexity | Lowest operational overhead; no new infrastructure; weakest relevance ranking and facet performance |
| **Meilisearch** | Small-to-mid catalogs, fast typo-tolerant search, simple self-hosted setup | Good relevance out of the box, low ops burden, open-source, self-hostable |
| **Elasticsearch / OpenSearch** | Large catalogs, complex faceted filtering, high query volume, need for aggregations in admin reports too | Highest operational complexity (cluster management, reindexing strategy); most powerful and battle-tested |
| **Algolia** | Mid-to-large catalogs, want managed/hosted with minimal ops, fast time-to-launch | SaaS pricing scales with records/queries; no infra to manage; strong out-of-box relevance and typo tolerance |

### Requirements regardless of engine chosen
- Index must be kept in sync with product create/update/delete/publish-status changes — via a queued job on write, not a nightly batch only (stale search results on a freshly published product is a common launch bug).
- Faceted filters (category, brand, attribute values, price range, in-stock status) must be served from the search index, not computed with separate live SQL queries per facet.
- Search must respect publication status and stock visibility rules — unpublished products must never appear in search results regardless of relevance score.
- Define and test behavior for zero-result queries (suggest corrections/related terms) and pagination consistency under concurrent catalog updates.
- SEO-friendly URLs and crawlable category/filter pages (base §7 SEO requirement) must not depend on the search engine being reachable — server-render a fallback or cache category listing pages.

### Acceptance criteria
- [ ] A specific search engine is named and documented as the project's choice, with the decision rationale recorded.
- [ ] Search index updates are triggered on product write operations, not solely on a schedule.
- [ ] Unpublished or out-of-stock-hidden products never appear in search results.
- [ ] Faceted filter counts match what a direct DB query would return for the same criteria (spot-checked in tests).

---

## Addendum Acceptance Checklist (append to base §8)

- [ ] Buyer can request a partial or full return within the eligible window; inventory restores only after inspection.
- [ ] Every paid order has a downloadable, immutable-snapshot invoice PDF; returns/refunds generate linked credit notes.
- [ ] Contact-us submissions are stored, rate-limited, and order-context messages are ownership-checked.
- [ ] Coupon discounts are recalculated server-side at both cart-apply and order-creation time; usage is recorded only on order success.
- [ ] Flash-sale stock decrements use one atomic/locking path; concurrent last-unit checkouts do not oversell.
- [ ] No floating-point type is used anywhere in the codebase for monetary values; all money fields carry a currency and a stored historical exchange rate.
- [ ] Related, cross-sell, and upsell relationships are modeled and queried independently, with automatic suggestions computed by a scheduled job.
- [ ] Abandoned-cart recovery only emails explicitly captured addresses, respects consent rules, and stops on conversion/unsubscribe.
- [ ] A named search engine is documented, keeps its index in sync on writes, and never surfaces unpublished products.

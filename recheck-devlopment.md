Recheck the entire existing Laravel + React e-commerce project against the checklist below.

**Important:** Do NOT rebuild or duplicate features that already exist. First inspect the codebase, database, API routes, controllers, models, migrations, and React pages. If a feature already exists and works, keep it. If it is partially implemented, complete it. If it is missing, implement it.

## MUST-HAVE CHECKLIST

### 1. 🔐 Passwordless Authentication — VERY IMPORTANT

There must be **NO traditional password login and NO traditional registration page**.

Implement a single modern authentication flow:

* Login using **Phone OR Email**
* User enters phone/email
* System sends OTP
* User enters OTP
* If the account exists → login
* If the account does NOT exist → automatically create the customer account and login
* **No separate registration process**
* No password field
* No username/password authentication
* No registration form
* Email OTP support
* Phone/SMS OTP support
* International phone number support
* OTP expiration
* Resend OTP cooldown
* Maximum OTP verification attempts
* Rate limiting / brute-force protection
* Secure OTP storage (never store plain OTP)
* OTP verification API
* Logout
* Token/session management
* Proper handling of invalid/expired OTP
* Existing customer + new customer flows must both work

The frontend must have a clean flow like:

`Enter Phone/Email → Send OTP → Enter OTP → Automatically Login/Register`

Do not require the user to choose "Login" or "Register".

### 2. 👤 Customer Foundation

Verify that the API supports:

* Customer profile
* Phone
* Email
* Multiple addresses
* Default address
* Order history
* Customer status
* Guest customer
* Customer cart
* Wishlist

### 3. 🛒 Guest Cart

Verify:

* Add products to cart without login
* Guest cart identifier
* Add/update/remove cart items
* Cart persistence
* Guest cart → customer cart merge after OTP login
* Existing customer cart must not be incorrectly overwritten

### 4. 📦 Product/Catalog

Verify:

* Products
* Categories
* Subcategories
* Brands
* Product variants
* Attributes/options
* SKU
* Barcode
* Product images
* Pricing
* Sale pricing
* Product status
* SEO fields
* Product search
* Product filtering
* Product sorting

### 5. 📊 Inventory

Verify:

* Stock quantity
* Reserved quantity
* Available quantity
* Low-stock threshold
* Stock adjustment
* Stock movement/history
* Warehouse-ready structure

### 6. 🧾 Orders

Verify:

* Order creation
* Order items
* Order number
* Customer/guest information
* Billing/shipping address
* Order status
* Payment status
* Shipping status
* Discounts
* Tax
* Shipping charges
* Cancellation-ready structure
* Refund-ready structure

### 7. 💳 Commerce Configuration

Verify admin configuration for:

* Currency
* Tax
* Shipping methods
* Payment methods
* Countries
* Regions/states
* Order statuses
* Product types
* Units

### 8. 👨‍💼 Admin

Verify:

* Admin authentication
* Admin/user management
* Roles
* Permissions
* Policies/authorization
* Activity/audit logs
* Notifications
* Admin profile/settings

### 9. 📈 Dashboard

Verify the React admin dashboard contains:

* Revenue
* Orders
* Customers
* Products
* Sales statistics
* Sales chart
* Recent orders
* Top-selling products
* Low-stock products
* Recent activity
* Global search
* Proper loading states
* Empty states
* Error states

### 10. 🌍 Global/Scalable Architecture

Verify the system is designed for:

* Multiple countries
* Multiple currencies
* Multiple languages
* International phone numbers
* Multiple warehouses
* Different business types
* Future mobile applications
* Future React storefront
* Future POS
* API consumers other than React

### 11. 🔌 API-FIRST RULE

Everything must be API-based.

Check that:

* React communicates through REST APIs
* APIs use versioning such as `/api/v1/...`
* Controllers return consistent JSON responses
* API Resources are used where appropriate
* Validation uses API/Form Requests
* Authentication is API-compatible
* Authorization is enforced server-side
* Business logic is not duplicated in React

### 12. 🗄️ Database & Architecture

Check:

* Migrations
* Foreign keys
* Relationships
* Indexes
* Unique constraints
* Soft deletes where appropriate
* Factories
* Seeders
* Proper service/business logic separation
* No unnecessary duplicated tables or logic

### 13. 🔒 Security

Verify:

* API rate limiting
* OTP rate limiting
* OTP attempt limits
* Secure OTP storage
* Authorization/policies
* Input validation
* Mass-assignment protection
* Secure file uploads
* Audit logging
* Proper API error handling

## FINAL INSTRUCTION

After checking everything:

1. Create a checklist/report showing:

   * ✅ Already implemented
   * ⚠️ Partially implemented
   * ❌ Missing

2. Then **implement only ⚠️ and ❌ items**.

3. Do not remove or break existing functionality.

4. Do not create duplicate features.

5. Do not build the customer storefront yet.

6. Keep the **current default theme, UI, colors, spacing, typography, component sizes, and overall design unchanged**. Do not redesign the existing admin UI.

7. Focus on completing the **backend/API + React admin foundation** so the storefront can be developed later using the same APIs.

8. After implementation, verify the important flows, especially:

**Phone OTP → existing customer login**

**Phone OTP → new customer auto-account creation → login**

**Email OTP → existing customer login**

**Email OTP → new customer auto-account creation → login**

**Guest cart → OTP login → cart merge**

No traditional login or registration should remain anywhere in the application.

Build a **modern, global, API-first e-commerce admin platform** using the existing Laravel + React starter kit.

### Core rule

- **Backend:** Laravel REST API
- **Frontend:** React admin dashboard consuming only APIs
- No business logic inside React.
- Design the API so the same backend can later power a web storefront, mobile apps, POS, marketplaces, etc.
- Do not build the customer storefront yet. Focus only on the admin panel and core backend foundation.

### Authentication foundation

Use modern passwordless authentication:

- OTP login via **phone or email**
- No traditional username/password login
- OTP verification, expiration, resend cooldown, attempt limits
- Secure token/session management
- Support international phone numbers
- Design authentication so additional providers (Google, Apple, etc.) can be added later.

### Admin dashboard

Create a professional, responsive SaaS-style admin panel with:

- Dashboard overview
- Sales/revenue/orders/customers statistics
- Recent orders
- Low-stock products
- Top-selling products
- Sales charts
- Notifications/activity
- Global search
- Responsive sidebar/navigation
- Profile/settings
- Proper loading, empty, error and success states

### Core e-commerce foundation

Build the database/API/admin management for:

**Catalog**

- Products
- Categories/subcategories
- Brands
- Product variants
- Attributes/options
- SKU
- Barcode
- Pricing
- Sale pricing
- Multiple images
- Product status
- SEO fields

**Inventory**

- Stock quantity
- Reserved stock
- Low-stock threshold
- Inventory adjustments
- Stock movement/history
- Multi-warehouse-ready architecture

**Customers**

- Customer profiles
- Phone/email
- Addresses
- Order history
- Customer status
- Guest customer support

**Orders**

- Order management
- Order items
- Order status workflow
- Payment status
- Shipping status
- Customer/address information
- Discounts
- Taxes
- Shipping charges
- Refund/cancellation-ready architecture

### Guest shopping foundation

Even though the storefront is not being built yet, design the API/database to support:

- Add-to-cart **without login**
- Guest cart using secure cart/session identifier
- Merge guest cart into customer cart after OTP login
- Persistent customer carts
- Wishlist
- Recently viewed products

### Global/business-ready architecture

Do not hard-code the system for one particular business type.

Make it configurable for different businesses and countries:

- Currency
- Tax configuration
- Shipping methods
- Payment methods
- Order statuses
- Product types
- Units
- Countries/regions
- Multiple languages-ready
- Multi-currency-ready
- Multi-warehouse-ready
- Roles and permissions

### Admin security

Implement:

- Role-based permissions
- Admin/user management
- API authentication
- Authorization policies
- Activity/audit logs
- Rate limiting
- Validation
- Secure OTP handling
- Proper API error responses

### Development requirements

First inspect the existing Laravel React starter kit and **reuse its existing architecture/components where appropriate**.

Create:

- Clean migrations
- Models and relationships
- Form/API requests
- Services where business logic belongs
- Policies/permissions
- API Resources
- RESTful controllers
- API routes/versioning
- React admin pages
- Reusable React components
- Proper database indexes
- Seeders/factories
- API documentation where useful

Use clean, scalable, production-ready architecture.

**Important:** Do not add random features or build the storefront yet. Build the **core API + modern React admin panel foundation** first so future e-commerce features can be added without restructuring the application. and maintain current default theme ui,color, size


after completion Summary
Implemented a complete Laravel + React admin panel and REST API foundation per devlopment.md, reusing the existing starter architecture and theme.

Backend (Laravel 13 API)

21 migrations covering catalog, inventory, customers, orders, carts, settings, currencies, countries, tax/shipping/payment methods, attributes, OTP, activity logs
24 Eloquent models with relationships, casts, factories, and Spatie\Permission integration
7 API v1 controllers (Auth/OTP, Products, Categories, Brands, Customers, Orders, Carts, Dashboard)
12 API Resources, 9 Form Requests (API + Admin), 3 Services (OtpService, CartService, ActivityLogger)
Spatie permission tables + roles (admin, manager, staff)
Sanctum-authenticated API with public cart endpoints and public OTP throttled endpoints
Versioned API at /api/v1/*
Frontend (React19 + Inertia v3)

Reused app-sidebar, app-shell, app-content, ui/* primitives and theme
Admin pages: dashboard, products (index/form/show), categories, brands, customers, orders (index/show) at /admin/*
Dashboard with stats cards, recent orders, low stock, top-selling bars- Wayfinder-typed routes, breadcrumbs, sonner toastsGuest shopping
CartService with session-id carts, merge into customer cart after auth
Guest wishlist/recently-viewed tables included in schema

Validation
pint clean, npm run build succeeds, 76/76 tests pass
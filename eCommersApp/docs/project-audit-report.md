# Project Audit Report — eCommerce (Spring Boot + React)

**Audited:** 2026-10-27
**Backend:** `e:\CODE\Projects\eCommerce\eCommersApp` (Spring Boot 3.1.1, Java 17, PostgreSQL, Spring Security 6 + JWT)
**Frontend:** `E:\CODE\Projects\eCommerce\frontend` (React 18 CRA, react-router-dom v6, axios)

> This report is the Phase 1 deep scan. Fixes referenced here are implemented and tracked in
> `feature-implementation-report.md`, `api-gap-analysis.md`, and `security-review-report.md`.

---

## 1. Architecture Overview

The backend is a conventional layered Spring Boot app:
`Controller → Service (interface) → ServiceImpl → Repository (Spring Data JPA) → Model (JPA entities)`,
with JWT auth in `SecurityConfig` and PostgreSQL persistence. All routes are under base path `/ecom`.

The frontend is a Create React App SPA. There is **no global state management** (no Redux, no Context, no React Query) — all cross-page state is passed via `localStorage`. There is **no toast library**; user feedback uses `window.alert()`. Styling is plain per-component CSS plus inline styles.

---

## 2. Backend Findings

### 2.1 Controllers
11 controllers, all under `/ecom`. Endpoint inventory is in `api-gap-analysis.md`. Notable issues:
- `AdminController` POST `/ecom/admin` creates a **ROLE_ADMIN** user and is **public** — anyone can self-register as admin.
- `OrderController` DELETE `/ecom/orders/users/**` is **public** — unauthenticated order deletion.
- `AdminController` endpoints omit `@Valid`; `ReviewController` POST omits `@Valid`.
- `ProductController` add uses the **entity** `Product` directly as the request body instead of a DTO.
- Cart increase/decrease path variable is named `{cartId}` but the service treats it as `userId` — a semantic mismatch.

### 2.2 Services / ServiceImpl
- `CartServiceImpl.calculateCartTotal` = `sum(price × qty)`. **No tax, no shipping, no discount.**
- `CartServiceImpl.removeProductFromCart` recomputes the total from a **stale in-memory list** after a bulk-delete query, so the total can be wrong.
- `OrdersServiceImpl.placeOrder` copies cart items to order items and empties the cart, but **does not reduce inventory** (Product had no stock field) and does **not snapshot unit price** on the order item. `OrdersDTO` is returned with hardcoded strings (`"Pending"`, `orderDate="Currebt Date"` — a typo).
- `OrdersServiceImpl.updateOrders` is a **stub returning null**.
- `PaymentServiceImpl.makePayment` is **mock** but always hardcodes `PaymentMethod.UPI` / `PaymentStatus.SUCCESSFUL` and immediately flips the order to `SHIPPED` (skips CONFIRMED).
- `UserServiceImpl.addUser` throws a raw `RuntimeException("Email alredy Register")` (only caught by the generic 502 handler); `getAllUserDetails` constructs but never throws its empty-list exception.

### 2.3 Repositories
Custom queries exist (`ProductRepository.findByName`, `findAllByNameContainingIgnoreCase`, `OrderRepository.getAllOrderByUserId`, `CartItemRepository` modifying deletes, `UserRepository.findByEmail`). A native query joining a non-existent `Category` table was commented out.

### 2.4 Entities / JPA Mappings
- `Product`: only `name, imageUrl, isAvailable, description, price, category(String)`. **Missing** `shortDescription, sku, brand, images, discountPrice, stockQuantity, rating, active, createdDate, updatedDate`.
- `Orders.orderItem` has **no `mappedBy`** (unidirectional join column) while `OrderItem` also stores a loose `Integer orderId` — inconsistent modeling.
- Money modeled as `double` in `Cart`, `Orders`, `Payment` (precision risk).
- `Review.rating` uses `@Size(max=5)` — invalid for an `Integer` (should be `@Min/@Max`).
- **No `Category` entity. No `Wishlist` entity.**

### 2.5 DTOs
`CustomerDTO`, `AdminDTO`, `UserDTO`, `ProductDTO`, `OrdersDTO`, `OrderItemDTO`, `ShippingDTO`, `UserSignInDetail`. `UserSignInDetail.firstNAme` is misspelled and the frontend reads that exact misspelling.

### 2.6 Security Configuration
- JWT secret is a **hardcoded plaintext string** in `SecurityConstants` (committed to source).
- Generator writes the raw token to the `Authorization` response header **without** a `Bearer ` prefix, but the validator does `substring(7)` expecting one — a **prefix mismatch** the client must compensate for.
- CORS: `setAllowedOriginPatterns` is called three times in a row, so only the last value survives, while `setAllowCredentials(true)` is set — misconfigured.
- Product-create authorization targets `/ecom/product/**` but the real base is `/ecom/products/**`, so the intended ADMIN rule never matches.
- Public admin registration and public order deletion (as above).

### 2.7 Validation
Bean Validation is present on most DTOs and some entities-as-request-bodies, but gaps exist (Admin endpoints, Review POST, numeric rating).

### 2.8 Exception Handling
`GlobalExceptionhandler` is a single `@ControllerAdvice`, but **nearly every handler returns HTTP 502 BAD_GATEWAY** — validation should be 400, not-found should be 404, conflicts 409.

### 2.9 Logging
No structured logging. Several `System.out.println` debug statements remain in `CartServiceImpl`, `OrdersServiceImpl`, `ProductServiceImpl`. `logging.file.path` points at a Windows-only `f:/myspringlogs/`.

### 2.10 Database Configuration
`spring.jpa.hibernate.ddl-auto=create` — **drops and recreates the schema on every startup (data loss)**. DB credentials are plaintext in `application.properties`. No profiles, no externalized config, no `server.port`.

---

## 3. Frontend Findings

### 3.1 Build-breaking
- Navbar imports **FontAwesome** (`@fortawesome/*`) which is **not in `package.json`** — the app fails to compile as-is.

### 3.2 Routing
Client-side guard only checks presence of `localStorage` keys (`jwtToken`+`userid`/`adminid`); no token validation or expiry. Footer links to `/admin-Login` (capital L) which does not match the `/admin-login` route → 404.

### 3.3 API Integration
Shared axios instance (`api.jsx`) injects `Bearer <token>`, but several files use **raw axios** with hardcoded URLs (Registration, Product list, SingleProduct, AllProductAdmin list, OrderDetails cancel) so those calls **omit the auth header**. Hosts are inconsistent (`127.0.0.1` vs `localhost`). No response interceptor / global 401 handling.

### 3.4 State Management
None global; `localStorage` only. No expiry handling.

### 3.5 Forms & Validation
Login, Registration, AddProduct, ShippingDetails have **no validation**. `Profile` change-password input `name`/state keys mismatch (`newPassword` vs `newpass`/`passform`) so the typed value never binds — **feature broken**.

### 3.6 Cart Flow
Works via API but: `useEffect` deps `[cartId, totalAmount]` can cause refetch loops; currency shown inconsistently (`$` vs `₹`); typo `response.data.toalAmout`.

### 3.7 Checkout Flow
`ShippingDetails` saves **nothing** (only `console.log`). `PaymentForm` only `console.log`s card data. `Payment.jsx` calls `setTimeout(navigate("/"),1000)` **outside** `useEffect`, firing a redirect on every render — the receipt barely shows.

### 3.8 Authentication Flow
Admin "login" is just any valid credential with an `adminid` key set — **no role check**. Admin logout removes `"jwtTocken"` (typo) so the real token is never cleared. Possible **double `Bearer`** prefix.

### 3.9 Error Handling / UX
No toasts. Most `.catch` only `console.error`. Some `alert(error.response.data.message)` throws when `error.response` is undefined (network/CORS). Minimal loading states; no skeletons; no empty states; `Slider` interval never cleared (leak). `SignIn.jsx` empty; `AllCustomerAdmin.jsx` a dead stub.

---

## 4. Summary Tables

### 4.1 Existing Features
Registration, Login (user/admin via HTTP Basic → JWT), product listing/search/single view, cart CRUD + totals, order placement + history, mock payment, reviews, addresses, shippers/shipping, admin product/user/order views.

### 4.2 Missing Features
Category module, Wishlist module, extended Product fields, inventory/stock, tax calculation, admin dashboard metrics, pagination, related products, proper checkout (address+review step), order tracking timeline, logout token invalidation, response wrapper, Swagger grouping, toasts/skeletons/empty states.

### 4.3 Broken Functionality
Cart quantity endpoints (cartId/userId mismatch), order DTO hardcoded values, `updateOrders` stub, Profile change-password binding, ShippingDetails save, Payment redirect, admin logout typo, Footer admin link case, FontAwesome missing dependency.

### 4.4 Security Gaps
Public admin self-registration, public order deletion, hardcoded JWT secret, plaintext DB creds, 502-for-everything masking, CORS misconfig, client-only auth guard, JWT prefix mismatch. Details in `security-review-report.md`.

### 4.5 Performance Issues
`ddl-auto=create` on every boot, `double` money math, N+1 risk from eager relations and in-loop lookups, frontend refetch loops, uncleaned interval, re-fetch-on-every-filter instead of client filtering.

### 4.6 API Gaps
See `api-gap-analysis.md` (URL mismatches, missing endpoints for category/wishlist/dashboard, DTO leakage of entities).

### 4.7 UX Problems
No loading/skeleton/empty states, alert-based feedback, broken receipt flow, inconsistent currency, no responsive polish.

---

## 5. Recommended Fixes (prioritized)
1. **P0 – unblock journey & security:** cart quantity bug, order placement correctness, mock payment statuses, inventory reduction, exception HTTP statuses, lock down admin registration & order deletion, externalize secrets, fix CORS, change `ddl-auto`.
2. **P1 – missing modules:** Category, Wishlist, extended Product fields, admin dashboard, response wrapper, logging.
3. **P2 – frontend:** add FontAwesome, toasts, loading/skeleton/empty states, fix checkout/payment/profile bugs, env-based API base URL.
4. **P3 – polish:** pagination, related products, responsive CSS, tests.

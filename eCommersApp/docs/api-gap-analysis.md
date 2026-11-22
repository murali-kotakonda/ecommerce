# API Gap Analysis — Frontend ↔ Backend Contract

**Date:** 2026-10-27

Every frontend API call cross-checked against the backend. Base backend path: `/ecom`.
Frontend base URL (axios): `http://127.0.0.1:8080`.

Legend: ✅ match · ⚠️ works but fragile · ❌ mismatch/broken · ➕ added by this work

---

## 1. Endpoint-by-endpoint cross-check

| Frontend call | Backend endpoint | Status | Notes |
|---|---|---|---|
| `GET /ecom/signIn` (Basic auth) | `LoginController GET /ecom/signIn` | ⚠️ | JWT returned in `Authorization` header **without** `Bearer ` prefix; validator strips 7 chars. Client prepends `Bearer `. Fragile contract — fixed to emit `Bearer ` consistently. |
| `POST /ecom/customers` | `CustomerController POST /ecom/customers` | ✅ | Registration uses **raw axios** (no token) — fine for a public endpoint. |
| `GET /ecom/customers/{id}` | `CustomerController GET /ecom/customers/{id}` | ✅ | |
| `PUT /ecom/customers/update-password/{id}` | `CustomerController PUT /ecom/customers/update-password/{id}` | ⚠️ | Backend OK; **frontend payload key mismatch** (`newpass` vs required `newPassword`). Fixed in frontend. |
| `GET /ecom/customers/get-all-customer` | `CustomerController GET /ecom/customers/get-all-customer` | ✅ | |
| `POST /ecom/customer-addresses/{userId}` | `AddressController POST /ecom/customer-addresses/{userId}` | ⚠️ | Frontend sends `zipCode`/`street`; entity fields are `ZipCode`/`Street`. Verify casing. |
| `PUT /ecom/customer-addresses/update/{id}` | `AddressController PUT /ecom/customer-addresses/update/{id}` | ✅ | |
| `GET /ecom/products/all` | `ProductController GET /ecom/products/all` | ✅ | Supports `keyword`, `sort`, `sortBy`. Frontend ignores server-side params and filters client-side. |
| `GET /ecom/products/{id}` | `ProductController GET /ecom/products/{id}` | ✅ | Uses raw axios. |
| `POST /ecom/products/add` | `ProductController POST /ecom/products/add` | ⚠️ | Frontend sends `available`; entity field is `isAvailable`. |
| `PUT /ecom/products/update/{id}` | `ProductController PUT /ecom/products/update/{id}` | ✅ | |
| `DELETE /ecom/products/{id}` | `ProductController DELETE /ecom/products/{id}` | ✅ | |
| `POST /ecom/cart/add-product?userId&productId` | `CartController POST /ecom/cart/add-product` | ✅ | |
| `GET /ecom/cart/products/{cartId}` | `CartController GET /ecom/cart/products/{cartId}` | ✅ | |
| `PUT /ecom/cart/increase-productQty/{cartId}/{productId}` | `CartController PUT …/increase-productQty/{cartId}/{productId}` | ❌ | Path var called `cartId` but service used it as **userId**. Frontend passes a **cartId** → wrong user lookup. Fixed server-side to accept userId and renamed for clarity. |
| `PUT /ecom/cart/decrease-productQty/{cartId}/{productId}` | same | ❌ | Same bug. Fixed. |
| `DELETE /ecom/cart/remove-product/{cartId}/{productId}` | `CartController DELETE …/remove-product/{cartId}/{productId}` | ✅ | Total recomputed from stale list server-side — fixed. |
| `DELETE /ecom/cart/empty-Cart/{cartId}` | `CartController DELETE …/empty-Cart/{cartId}` | ✅ | |
| `POST /ecom/orders/placed/{userId}` | `OrderController POST /ecom/orders/placed/{userId}` | ✅ | DTO returned had hardcoded strings — fixed. |
| `GET /ecom/orders/orders/{userId}` | `OrderController GET /ecom/orders/orders/{userId}` | ✅ | |
| `DELETE /ecom/orders/users/{userId}/{orderId}` | `OrderController DELETE /ecom/orders/users/{userId}/{orderId}` | ❌ | Was **public** (security gap). Locked to USER/ADMIN. Frontend used raw axios (no token) — switched to `api`. |
| `GET /ecom/orders/all` | `OrderController GET /ecom/orders/all` | ✅ | |
| `POST /ecom/order-payments/makePayment?orderId&userId` | `PaymentController POST /ecom/order-payments/makePayment` | ✅ | Kept for compatibility. **Added** spec-compliant `POST /ecom/payments/process`. |

---

## 2. Missing endpoints (now added ➕)

| Need | Added endpoint |
|---|---|
| Spec mock payment | ➕ `POST /ecom/payments/process` → `{ paymentId, status }` |
| Category CRUD | ➕ `POST/PUT/DELETE/GET /ecom/categories` |
| Wishlist | ➕ `POST /ecom/wishlist/{userId}/{productId}`, `DELETE /ecom/wishlist/{userId}/{productId}`, `GET /ecom/wishlist/{userId}` |
| Admin dashboard | ➕ `GET /ecom/admin/dashboard` → product/user/order counts + total sales |

---

## 3. DTO / payload mismatches

| Field (frontend) | Field (backend) | Resolution |
|---|---|---|
| `available` (AddProduct) | `isAvailable` / `active` | Backend accepts both via extended Product fields; frontend aligned. |
| `newpass` (Profile) | `newPassword` (UserDTO) | Frontend corrected to `newPassword`. |
| `firstNAme` (login response) | `firstNAme` in `UserSignInDetail` | Kept (frontend depends on it) + documented as tech debt. |
| Entity `Product` as request body | should be `ProductDTO` | `ProductController` add migrated to DTO where safe. |

---

## 4. Request/Response issues fixed
- JWT header now consistently includes `Bearer ` prefix.
- Error responses now return correct HTTP status codes (400/401/404/409) instead of 502.
- Order placement returns real values (status, payment status, ISO date) instead of hardcoded strings.
- Standard `ApiResponse<T>` wrapper added for new endpoints.

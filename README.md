```markdown
# 🏠 RentNest - Rental Property Marketplace

A modern, full-featured rental property marketplace built with Next.js 14, TypeScript, and Tailwind CSS.

---

## 📖 Overview

RentNest is a complete rental property marketplace application where:

- **Tenants** can browse properties, submit rental requests, make secure payments, and leave reviews
- **Landlords** can list properties, manage availability, and respond to tenant requests
- **Admins** can oversee the entire platform, manage users, and moderate content

> 💡 **Note**: This is a **frontend-only** application. It consumes a REST API backend.

---

## ✨ Features

### 🏠 Public Features
- Responsive property grid with optimized images (`next/image`)
- Advanced search & filter (location, price range, property type, amenities)
- Property details page with image gallery and landlord info
- Loading skeletons and graceful error states (`error.tsx`, `not-found.tsx`)

### 👤 Tenant Features
- Registration & login with role selection (Zod validation)
- Submit rental requests with move-in date
- View request history with status badges (Pending, Approved, Rejected, Active, Completed)
- Secure payment via Stripe/SSLCommerz with success/cancel pages
- Leave reviews after rental completion

### 🏘️ Landlord Features
- Dashboard with property and request overview
- Create, edit, and delete property listings (with image upload UI)
- Manage incoming rental requests (Approve/Reject with toast notifications)
- Track earnings and active rentals

### 🛡️ Admin Features
- Dashboard with platform statistics (users, properties, rentals, revenue)
- User management (View, Ban/Unban with SweetAlert2 confirmation)
- Content moderation (Properties, Rentals, Categories)
- Bulk delete properties

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | React Query (TanStack Query) |
| **HTTP Client** | Axios |
| **Notifications** | Sonner (Toast) |
| **Icons** | Lucide React |
| **Authentication** | JWT (Local Storage) |
| **Payment** | Stripe / SSLCommerz |
| **Deployment** | render / render |

---

## 📁 Project Structure

```
rentnest-frontend/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── rentals/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── categories/
│   │   │       └── page.tsx
│   │   ├── landlord/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   └── requests/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   └── tenant/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── properties/
│   │       │   └── page.tsx
│   │       ├── rentals/
│   │       │   ├── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       ├── payments/
│   │       │   ├── page.tsx
│   │       │   └── create/
│   │       │       └── [id]/
│   │       │           └── page.tsx
│   │       └── reviews/
│   │           └── create/
│   │               └── page.tsx
│   ├── payment/
│   │   ├── success/
│   │   │   ├── page.tsx
│   │   │   └── PaymentSuccessContent.tsx
│   │   └── cancel/
│   │       ├── page.tsx
│   │       └── PaymentCancelContent.tsx
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── error.tsx             # Global error boundary
│   └── not-found.tsx         # 404 page
├── components/
│   ├── Properties/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── PropertyFilters.tsx
│   │   └── PropertyGallery.tsx
│   ├── Rentals/
│   │   ├── RequestForm.tsx
│   │   ├── RequestTable.tsx
│   │   └── RequestStatusBadge.tsx
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── Providers/
│       ├── AuthProvider.tsx
│       ├── ToastProvider.tsx
│       └── QueryProvider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useToast.ts
│   ├── useProperties.ts
│   ├── useRentalRequests.ts
│   ├── usePayments.ts
│   ├── useReviews.ts
│   └── useAdmin.ts
├── lib/
│   └── api/
│       ├── client.ts
│       ├── auth.ts
│       ├── properties.ts
│       ├── rentals.ts
│       ├── payments.ts
│       ├── reviews.ts
│       ├── admin.ts
│       └── landlord.ts
├── types/
│   ├── property.ts
│   ├── rental.ts
│   ├── request.ts
│   ├── review.ts
│   ├── user.ts
│   ├── payment.ts
│   └── admin.ts
├── public/
│   └── images/
├── middleware.ts              # Route protection
├── tailwind.config.ts
├── next.config.js
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm
- Backend API (running)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/smsamiulhasansaim/Rentnest-Frontend.git
cd rentnest-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Update environment variables**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

5. **Run development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open** `http://localhost:3000`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | For Stripe |
| `NEXT_PUBLIC_SSLCOMMERZ_STORE_ID` | SSLCommerz store ID | For SSLCommerz |

---

## 🔗 API Integration

### Base URL
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### API Endpoints Consumed

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/me` | GET | Get current user |
| `/api/properties` | GET | List properties |
| `/api/properties/:id` | GET | Get property details |
| `/api/categories` | GET | List categories |
| `/api/rentals` | GET/POST | Tenant rental requests |
| `/api/landlord/properties` | GET/POST/PUT/DELETE | Landlord property CRUD |
| `/api/landlord/requests` | GET/PATCH | Landlord request management |
| `/api/payments/create` | POST | Create payment session |
| `/api/payments/confirm` | POST | Confirm payment |
| `/api/reviews` | POST | Create review |
| `/api/admin/users` | GET/PATCH | Admin user management |
| `/api/admin/properties` | GET/DELETE | Admin property management |
| `/api/admin/rentals` | GET | Admin rental management |
| `/api/admin/categories` | GET/POST/PUT/DELETE | Admin category management |

---

## 👥 Roles & Permissions

| Role | Access | Features |
|------|--------|----------|
| **Tenant** | `/tenant/*` | Browse, Request, Pay, Review |
| **Landlord** | `/landlord/*` | List, Manage, Respond |
| **Admin** | `/admin/*` | Moderate, Manage, Oversee |

### Route Protection (Middleware)

```typescript
// middleware.ts
const roleRoutes = {
  TENANT: ['/tenant', '/payment'],
  LANDLORD: ['/landlord'],
  ADMIN: ['/admin'],
};
```

---

## 🚢 Deployment

### Deploy to render

1. Push code to GitHub
2. Go to [render](https://render.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Deploy to render

1. Push code to GitHub
2. Go to [render](https://render.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables
7. Deploy

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**S M Samiul Hasan**

- GitHub: [@samiuldev](https://github.com/smsamiulhasansaim)
- Email: hello.smsamiulhasan@gmail.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Lucide React for beautiful icons

---

**Built with ❤️ S M SAMIUL HASAN using Next.js 16**
```
# Shopzy E-commerce API

A full-stack e-commerce application built with Node.js, NestJS, and TypeScript. Features include user authentication, product management, cart handling, and a complete order workflow with clean, scalable architecture.

## 🚀 Features

- **User Authentication** - JWT-based authentication with role-based access control
- **Product Management** - CRUD operations for products, categories, and brands
- **Shopping Cart** - Manage user shopping carts
- **Order Processing** - Create and track orders
- **Coupon System** - Discount and promotional codes
- **Payment Integration** - Secure payment processing
- **Real-time Updates** - WebSocket support for real-time features

## 🛠️ Tech Stack

- **Backend Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: Stripe integration
- **Email**: Nodemailer
- **Caching**: Redis
- **Validation**: Class-validator & Zod
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📦 Prerequisites

- Node.js (v18+)
- MongoDB
- Redis (for caching)
- Stripe account (for payment processing)

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/AbdoSakrEgy/ShopzyApp.git
   cd shopzy-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the project root
   - Copy variables from `.env.example` to `.env`
   - Update the values with your configuration

4. **Run the application**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏗️ Project Structure

```
src/
├── modules/         # Feature modules
│   ├── auth/        # Authentication
│   ├── brand/       # Brand management
│   ├── cart/        # Shopping cart
│   ├── category/    # Category management
│   ├── coupon/      # Coupon system
│   ├── order/       # Order processing
│   └── product/     # Product management
├── common/          # Shared modules and utilities
├── DB/              # Database models and schemas
└── uploads/         # File uploads
```

## 🔒 Environment Variables

Required environment variables:

```
MONGOOSE_URI=mongodb://localhost:27017/shopzy
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
STRIPE_SECRET_KEY=your_stripe_secret_key
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in Touch

- 👤 **Author:** [Abdulrahim Sakr](https://www.linkedin.com/in/abdulrahim-sakr-336937258/)
- 🌐 **Portfolio:** [abdulrahim01.netlify.app](https://abdulrahim01.netlify.app/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

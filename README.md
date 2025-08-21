# 💡 BrainstormVerse

A modern idea-sharing platform where creativity meets collaboration. Share your thoughts, discover innovative ideas, and connect with like-minded creators in a beautifully designed interface.

![Next.js](https://img.shields.io/badge/Next.js-14.2.32-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.10-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0.0-green?style=flat-square&logo=mongodb)

## ✨ Features

- 🔐 **Secure Authentication** - Powered by Clerk for seamless user management
- 💭 **Idea Sharing** - Create and share your innovative ideas with the community
- 👤 **User Profiles** - Personalized profiles with onboarding experience
- 💬 **Comments & Discussions** - Engage with others through threaded conversations
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern Interface** - Clean design with TailwindCSS and shadcn/ui components
- 📁 **File Uploads** - Share images and files with your ideas using UploadThing
- 🔍 **Real-time Updates** - Stay connected with live content updates

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **File Uploads**: [UploadThing](https://uploadthing.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- MongoDB database
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sagargupta16/brainstorm-verse.git
   cd brainstorm-verse
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
   
   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Database
   MONGODB_URL=your_mongodb_connection_string
   
   # UploadThing
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```text
brainstorm-verse/
├── app/
│   ├── (auth)/           # Authentication routes
│   │   ├── onboarding/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/           # Main application routes
│   │   ├── create-idea/
│   │   └── page.tsx
│   └── api/              # API routes
├── components/
│   ├── cards/            # Reusable card components
│   ├── forms/            # Form components
│   ├── shared/           # Shared layout components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── actions/          # Server actions
│   ├── models/           # Database models
│   ├── validations/      # Zod schemas
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account or log in using Clerk authentication
2. **Complete Onboarding**: Set up your profile with basic information
3. **Create Ideas**: Share your thoughts and innovations with the community
4. **Explore**: Browse ideas from other users and engage through comments
5. **Profile Management**: Update your profile and view your activity

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Clerk](https://clerk.com/) for seamless authentication
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- All the amazing open-source libraries that make this project possible

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or reach out to the maintainers.

## 📖 Development Documentation

This section contains detailed setup instructions for developers who want to build this project from scratch or understand the development process.

### 🚀 Creating a New Next.js App (From Scratch)

If you want to recreate this project from scratch:

```bash
npx create-next-app@latest ./
```

**Configuration Options:**

- TypeScript: Yes
- TailwindCSS: Yes  
- App Router: Yes

### 📦 Core Dependencies Installation

```bash
npm install @clerk/nextjs @uploadthing/react mongoose svix uploadthing
```

**Key Dependencies Explained:**

- **@clerk/nextjs**: Developer-first identity and user management system providing complete authentication, authorization, and user profiles
- **uploadthing**: File upload service with simple API and React components for handling user file uploads
- **mongoose**: MongoDB object modeling tool designed for asynchronous environments with promise and callback support
- **svix**: Service for sending webhooks with simple API and React components

### 🎨 UI Setup

Install additional UI dependencies:

```bash
npm install tailwindcss-animate
```

**Setup Steps:**

- Customize `app/globals.css` according to your design needs
- Configure `tailwind.config.js` for your styling requirements
- Clean up default content in `app/page.tsx`

### 📁 Folder Structure Setup

**Route Groups Configuration:**

- **Auth Routes**: Authentication-related pages
  - Sign-in, Sign-up, Onboarding pages
  - Uses Next.js route groups `(auth)`
  
- **Root Routes**: Main application pages  
  - Home, Create Idea, and other core features
  - Uses Next.js route groups `(root)`

**Clerk Route Structure:**
Create the following folder structure for Clerk authentication:

```text
app/
└── (auth)/
    ├── sign-in/
    │   └── [[...sign-in]]/
    │       └── page.tsx
    └── sign-up/
        └── [[...sign-up]]/
            └── page.tsx
```

### 🔐 Clerk Authentication Setup

1. **Create Clerk Account**: Sign up at [clerk.com](https://clerk.com)
2. **Create New Project**: Set up your application in Clerk dashboard
3. **Environment Variables**: Add to `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

1. **Follow Documentation**: Complete setup using [Clerk's Next.js documentation](https://clerk.com/docs/nextjs)

### 📁 UploadThing File Upload Setup

For detailed UploadThing setup, refer to this comprehensive tutorial:
[UploadThing Setup Tutorial](https://www.youtube.com/watch?v=O5cmLDVTgAs&list=WL&index=4&t=215s) (timestamp: 3:13:58 / 5:50:34)

**Key Setup Steps:**

1. Create UploadThing account
2. Configure API keys in environment variables
3. Set up file upload endpoints
4. Integrate upload components in your forms

---

Made with ❤️ by [Sagar Gupta](https://github.com/Sagargupta16)

## Documentation

### Create a new Next.js app

```bash
npx create-next-app@latest ./
```

TypeScript yes
TailwindCSS yes
App Router yes

### Install dependencies

```bash
npm install @clerk/nextjs @uploadthing/react mongoose svix uploadthing
```

clerk : Clerk is a developer-first identity and user management system. It provides a complete user management backend for your application, including authentication, authorization, and user profiles.

uploadthing : UploadThing is a file upload service that makes it easy to upload files from your users to your application. It provides a simple API for uploading files, and a React component for displaying a file upload widget.

mongoose : Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

svix : Svix is a service for sending webhooks. It provides a simple API for sending webhooks, and a React component for displaying a webhook widget.

### Setting Up app Details

- Delete all Content inside main tag in app/page.tsx
- Customize app/global.css & tailwind.config.js According to your need also install tailwindcss-animate

```bash
npm install tailwindcss-animate
```

### Setting up Folder Structure

- Route Groups : Auth, Root

  - Auth : Signin, Signup, onboarding
  - Root : layout, pages

- Create a folder named "auth" inside pages folder and create a folder named "sign-in" inside auth folder and create a folder [[...sign-in]] inside sign-in folder and create a file named "page.tsx" inside [[...sign-in]] folder , Same for signup.

### Setting up Clerk

Create Account on Clerk and create a project and copy the API key and paste it in .env.local file

```bash
CLERK_FRONTEND_API_KEY=clerk.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then Follow the steps on Clerk Documentation to setup Clerk in your app.

### Setting up UploadThing

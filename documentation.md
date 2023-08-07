## Documentation

### Create a new Next.js app

```bash
npx create-next-app@latest ./ 
```

TypeScript  yes
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
- Customize app/global.css & tailwind.config.js According to your need

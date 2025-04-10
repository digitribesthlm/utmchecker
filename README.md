This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

### Environment Variables

This application uses environment variables to configure the n8n chat widget. Before running the application:

1. Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and set your n8n chat URL:
```
NEXT_PUBLIC_CHAT_URL=your_n8n_chat_url_here
```

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Features

- Simple authentication system
- UTM link generator with form input
- Recent links history stored in local storage
- n8n chat integration for support

## Authentication

The application uses a simple authentication system with credentials stored in environment variables:

```bash
# In your .env.local file
AUTH_USER_ID=your_user_id
AUTH_PASSWORD=your_password
```

**Note**: This is a simple authentication implementation intended for basic protection. For production applications, consider using a more secure authentication method.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

When deploying to Vercel or another hosting platform, set the `NEXT_PUBLIC_CHAT_URL` environment variable in the hosting platform's environment configuration.

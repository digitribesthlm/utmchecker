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

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

## Features

- Simple authentication system
- UTM link generator with form input
- Recent links history stored in local storage
- n8n chat integration for support

## Authentication

The application uses a simple authentication system with hardcoded credentials:

- User ID: 1234567890
- Password: 1234567890

**Note**: This is a simple authentication implementation intended for basic protection. For production applications, consider using a more secure authentication method.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

When deploying to Vercel or another hosting platform, set the `NEXT_PUBLIC_CHAT_URL` environment variable in the hosting platform's environment configuration.

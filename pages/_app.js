import "@/styles/globals.css";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication and initialize chat
  useEffect(() => {
    const auth = localStorage.getItem('utm_auth') === 'true';
    setIsAuthenticated(auth);

    // Only show chat on authenticated pages (not on login page)
    if (auth && router.pathname !== '/') {
      // Add required stylesheet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      document.head.appendChild(link);

      // Create chat div
      const chatDiv = document.createElement('div');
      chatDiv.id = 'n8n-chat';
      document.body.appendChild(chatDiv);

      // Add chat script
      const script = document.createElement('script');
      script.type = 'module';
      script.textContent = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        createChat({
          webhookUrl: '${process.env.NEXT_PUBLIC_UTM_WEBHOOK}',
          target: '#n8n-chat',
          mode: 'window'
        });
      `;
      document.body.appendChild(script);

      return () => {
        link.remove();
        chatDiv.remove();
        script.remove();
      };
    }
  }, [isAuthenticated, router.pathname]); // Re-run when authentication state or page changes

  // Listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('utm_auth') === 'true';
      setIsAuthenticated(auth);
    };

    // Check auth on mount and when localStorage changes
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    // Also check when user navigates between pages
    router.events.on('routeChangeComplete', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      router.events.off('routeChangeComplete', checkAuth);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>UTM Link Builder</title>
        <meta name="description" content="Create and manage UTM tracking links" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

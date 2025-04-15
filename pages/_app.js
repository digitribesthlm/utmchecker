import "@/styles/globals.css";
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication and initialize chat
  useEffect(() => {
    const auth = localStorage.getItem('utm_auth') === 'true';
    setIsAuthenticated(auth);

    if (auth) {
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
  }, [isAuthenticated]); // Re-run when authentication state changes

  // Listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('utm_auth') === 'true';
      setIsAuthenticated(auth);
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

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

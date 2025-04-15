import "@/styles/globals.css";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize authentication state
  useEffect(() => {
    const auth = localStorage.getItem('utm_auth') === 'true';
    setIsAuthenticated(auth);
  }, []);

  // Handle chat initialization
  useEffect(() => {
    // Only show chat on authenticated pages (not on login page)
    if (isAuthenticated && router.pathname !== '/') {
      // Remove any existing chat elements first
      const existingChat = document.getElementById('n8n-chat');
      const existingScript = document.querySelector('script[type="module"]');
      const existingStyle = document.querySelector('link[href*="n8n/chat/dist/style.css"]');
      
      if (existingChat) existingChat.remove();
      if (existingScript) existingScript.remove();
      if (existingStyle) existingStyle.remove();

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
          mode: 'window',
          showWelcomeScreen: true,
          initialMessages: [
            'Hi there! 👋',
            'How can I help you with UTM tracking?'
          ],
          i18n: {
            en: {
              title: 'UTM Link Builder',
              subtitle: "Need help with UTM tracking? I'm here to assist you.",
              footer: '',
              getStarted: 'New Conversation',
              inputPlaceholder: 'Type your message...'
            }
          }
        });
      `;
      document.body.appendChild(script);

      return () => {
        link.remove();
        chatDiv.remove();
        script.remove();
      };
    }
  }, [isAuthenticated, router.pathname, router.isReady]); // Add router.isReady to ensure route is available

  // Listen for auth changes
  useEffect(() => {
    function handleAuthChange() {
      const auth = localStorage.getItem('utm_auth') === 'true';
      setIsAuthenticated(auth);
    }

    // Set up event listeners
    window.addEventListener('storage', handleAuthChange);
    router.events.on('routeChangeComplete', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      router.events.off('routeChangeComplete', handleAuthChange);
    };
  }, [router.events]);

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

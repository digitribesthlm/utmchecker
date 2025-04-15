import "@/styles/globals.css";
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('utm_auth') === 'true';
      
      // Only initialize chat if user is authenticated
      if (isAuthenticated) {
        // Load n8n chat script and initialize chat widget
        const initializeChat = () => {
          // Read both environment variables
          const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL;
          const utmWebhook = process.env.NEXT_PUBLIC_UTM_WEBHOOK;
          
          // Use either one that's available (preferring CHAT_URL if both exist)
          const webhookUrl = chatUrl || utmWebhook;
          
          if (!webhookUrl) {
            console.warn('Chat widget not initialized: No webhook URL available in environment variables');
            return;
          }
          
          console.log('Using webhook URL:', webhookUrl);
          
          // Create target div for chat if it doesn't exist
          if (!document.getElementById('n8n-chat')) {
            const chatDiv = document.createElement('div');
            chatDiv.id = 'n8n-chat';
            document.body.appendChild(chatDiv);
          }
          
          // Add the style
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
          document.head.appendChild(link);
          
          // Create the script element for the chat widget with direct static URL
          const script = document.createElement('script');
          script.type = 'module';
          
          // Set up the chat initialization with the webhook URL directly in the code
          script.textContent = `
            import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
            
            createChat({
              webhookUrl: '${webhookUrl}',
              target: '#n8n-chat',
              mode: 'window',
              showWelcomeScreen: true,
              initialMessages: [
                'Hi there! 👋',
                'How can I assist you today?'
              ],
              i18n: {
                en: {
                  title: 'UTM Link Builder',
                  subtitle: "Need help with UTM tracking? I'm here to assist you.",
                  footer: '',
                  getStarted: 'New Conversation',
                  inputPlaceholder: 'Type your question..',
                }
              }
            });
          `;
          
          // Append the script to the document
          document.body.appendChild(script);
          
          return {
            script,
            link,
            chatDiv: document.getElementById('n8n-chat'),
          };
        };
        
        // Initialize the chat and get the elements for cleanup
        const elements = initializeChat();
        
        // Return cleanup function
        return () => {
          if (elements) {
            if (elements.script && document.body.contains(elements.script)) {
              document.body.removeChild(elements.script);
            }
            if (elements.link && document.head.contains(elements.link)) {
              document.head.removeChild(elements.link);
            }
            if (elements.chatDiv && document.body.contains(elements.chatDiv)) {
              document.body.removeChild(elements.chatDiv);
            }
          }
        };
      }
    }
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

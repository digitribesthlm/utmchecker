import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const UTMForm = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('utm_auth');
      if (auth !== 'true') {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('utm_auth');
    router.push('/');
  };

  const [formData, setFormData] = useState({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [baseUrl, setBaseUrl] = useState('https://example.com');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [showGeneratedUrl, setShowGeneratedUrl] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [recentLinks, setRecentLinks] = useState([]);

  // Sample data for dropdown options
  const sources = ['Google', 'Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'Email'];
  const mediums = ['CPC', 'Email', 'Social', 'Organic', 'Referral', 'Display'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBaseUrlChange = (e) => {
    setBaseUrl(e.target.value);
  };

  // Store link in local storage as fallback when webhook fails
  const storeLocalLink = (utmData) => {
    try {
      // Get existing links from localStorage or initialize empty array
      const existingLinks = JSON.parse(localStorage.getItem('utm-links') || '[]');
      
      // Add new link to the beginning of the array
      const updatedLinks = [
        {
          url: utmData.url,
          timestamp: utmData.timestamp,
          parameters: {
            source: utmData.source,
            medium: utmData.medium,
            campaign: utmData.campaign,
            term: utmData.term,
            content: utmData.content
          }
        },
        ...existingLinks
      ].slice(0, 10); // Keep only the 10 most recent links
      
      // Update localStorage
      localStorage.setItem('utm-links', JSON.stringify(updatedLinks));
      
      // Update state
      setRecentLinks(updatedLinks);
      
      console.log('Link stored locally');
    } catch (error) {
      console.error('Error storing link locally:', error);
    }
  };

  // Load links from localStorage on initial render
  React.useEffect(() => {
    try {
      const storedLinks = JSON.parse(localStorage.getItem('utm-links') || '[]');
      setRecentLinks(storedLinks);
    } catch (error) {
      console.error('Error loading links from localStorage:', error);
    }
  }, []);

  const sendToWebhook = (url) => {
    // Create data object for both webhook and local storage
    const utmData = {
      url: url,
      timestamp: new Date().toISOString(),
      source: formData.source || '',
      medium: formData.medium || '',
      campaign: formData.campaign || '',
      term: formData.term || '',
      content: formData.content || ''
    };
    
    // Store link locally first (as a fallback)
    storeLocalLink(utmData);
    
    // Try to send to webhook with error handling
    try {
      // Define the webhook URL
      const baseWebhookUrl = 'https://n8n.digitribe.se/webhook/ff6779da-0dab-48cf-8cf0-a7db48c52a47';
      
      // Prepare query parameters
      const params = new URLSearchParams({
        url: utmData.url,
        timestamp: utmData.timestamp,
        source: utmData.source,
        medium: utmData.medium,
        campaign: utmData.campaign,
        term: utmData.term,
        content: utmData.content
      });
      
      // Construct full URL with query parameters
      const webhookUrl = `${baseWebhookUrl}?${params.toString()}`;
      
      // Add CORS proxy if in browser environment
      // Note: This is a temporary solution and should be replaced with a proper backend implementation
      fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'no-cors', // Add this to prevent CORS issues
      })
      .then(response => {
        console.log('Webhook response received');
        // With mode: 'no-cors', we can't access response status or body
        // So we just assume it worked
      })
      .catch(error => {
        console.error('Error sending URL to webhook:', error);
        // Webhook failed, but we already stored the link locally as a fallback
      });
    } catch (error) {
      console.error('Error in webhook function:', error);
      // If something goes wrong in the try block, we still have our local storage fallback
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to generate UTM link
    const utmParameters = [];
    
    if (formData.source) utmParameters.push(`utm_source=${encodeURIComponent(formData.source)}`);
    if (formData.medium) utmParameters.push(`utm_medium=${encodeURIComponent(formData.medium)}`);
    if (formData.campaign) utmParameters.push(`utm_campaign=${encodeURIComponent(formData.campaign)}`);
    if (formData.term) utmParameters.push(`utm_term=${encodeURIComponent(formData.term)}`);
    if (formData.content) utmParameters.push(`utm_content=${encodeURIComponent(formData.content)}`);
    
    const utmString = utmParameters.join('&');
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const separator = cleanBaseUrl.includes('?') ? '&' : '?';
    
    const utmLink = `${cleanBaseUrl}${separator}${utmString}`;
    setGeneratedUrl(utmLink);
    setShowGeneratedUrl(true);
    setCopySuccess(false);
    
    // Send the URL to the webhook when generated
    sendToWebhook(utmLink);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  const handleReset = () => {
    setFormData({
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: ''
    });
    setBaseUrl('https://example.com');
    setShowGeneratedUrl(false);
    setCopySuccess(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Loading...</div>
      </div>
    );
  }

  // Show content only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Head>
        <title>UTM Link Builder</title>
        <meta name="description" content="Create and manage UTM tracking links" />
      </Head>
      
      <header style={{ backgroundColor: '#0052cc', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>UTM Builder</h1>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/utm-form" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none', fontWeight: 'bold' }}>
            Home
          </Link>
          <Link href="/admin" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>
            Admin
          </Link>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </nav>
      </header>
      
      <main style={{ maxWidth: '800px', margin: '40px auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>Create UTM Link</h2>
        <p style={{ textAlign: 'center', color: '#666' }}>Build trackable links for your marketing campaigns with standardized UTM parameters.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Website URL *
            </label>
            <input 
              type="text" 
              placeholder="https://example.com/landing-page" 
              value={baseUrl}
              onChange={handleBaseUrlChange}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} 
              required
            />
            <small style={{ color: '#666', display: 'block', marginTop: '3px' }}>The full website URL (e.g. https://www.example.com)</small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Campaign Source *
            </label>
            <select 
              name="source" 
              value={formData.source} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            >
              <option value="">Select source</option>
              {sources.map((source) => (
                <option key={source} value={source.toLowerCase()}>{source}</option>
              ))}
            </select>
            <small style={{ color: '#666', display: 'block', marginTop: '3px' }}>The referrer (e.g. google, newsletter)</small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Campaign Medium *
            </label>
            <select 
              name="medium" 
              value={formData.medium} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            >
              <option value="">Select medium</option>
              {mediums.map((medium) => (
                <option key={medium} value={medium.toLowerCase()}>{medium}</option>
              ))}
            </select>
            <small style={{ color: '#666', display: 'block', marginTop: '3px' }}>Marketing medium (e.g. cpc, banner, email)</small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Campaign Name *
            </label>
            <input 
              type="text" 
              name="campaign" 
              placeholder="summer-sale" 
              value={formData.campaign} 
              onChange={handleChange} 
              required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} 
            />
            <small style={{ color: '#666', display: 'block', marginTop: '3px' }}>Product, promo code, or slogan (e.g. spring_sale). One of campaign name or campaign id are required.</small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Campaign Term (Optional)
            </label>
            <input 
              type="text" 
              name="term" 
              placeholder="running+shoes" 
              value={formData.term} 
              onChange={handleChange} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} 
            />
            <small style={{ color: '#666', display: 'block', marginTop: '3px' }}>Identify the paid keywords</small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Campaign Content (Optional)
            </label>
            <input 
              type="text" 
              name="content" 
              placeholder="logolink" 
              value={formData.content} 
              onChange={handleChange} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} 
            />
            <small style={{ color: '#666', display: 'block', marginTop: '3px' }}>Use to differentiate ads</small>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button 
              type="submit" 
              style={{ 
                padding: '10px 20px', 
                borderRadius: '4px', 
                backgroundColor: '#0052cc', 
                color: '#fff', 
                border: 'none', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Generate UTM URL →
            </button>
            
            <button 
              type="button" 
              onClick={handleReset}
              style={{ 
                padding: '10px 20px', 
                borderRadius: '4px', 
                backgroundColor: '#fff', 
                color: '#333', 
                border: '1px solid #ccc', 
                cursor: 'pointer'
              }}
            >
              Reset Form
            </button>
          </div>
        </form>
        
        {showGeneratedUrl && (
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            backgroundColor: '#e8f5ff', 
            borderRadius: '4px', 
            border: '1px solid #0052cc',
            position: 'relative'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0052cc' }}>Generated UTM URL</h3>
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '15px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '15px'
            }}>
              {generatedUrl}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={handleCopyUrl} 
                style={{ 
                  padding: '8px 15px', 
                  borderRadius: '4px', 
                  backgroundColor: copySuccess ? '#4caf50' : '#0052cc', 
                  color: '#fff', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
              >
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              {copySuccess && (
                <span style={{ 
                  marginLeft: '10px', 
                  color: '#4caf50', 
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    style={{ marginRight: '5px' }}
                  >
                    <path 
                      fill="currentColor" 
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    />
                  </svg>
                  URL copied to clipboard
                </span>
              )}
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '30px' }}>
          <h3>Recent Links</h3>
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            {recentLinks.length > 0 ? (
              <div>
                {recentLinks.map((link, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      marginBottom: '15px', 
                      padding: '10px', 
                      backgroundColor: '#fff', 
                      borderRadius: '4px',
                      border: '1px solid #eee'
                    }}
                  >
                    <div style={{ fontSize: '14px', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '5px' }}>
                      {link.url}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      <span style={{ color: '#0052cc', fontWeight: 'bold' }}>{link.parameters.source}</span> | {link.parameters.medium} | {link.parameters.campaign}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      {formatDate(link.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>Your recently generated UTM links will appear here</p>
            )}
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h3>More information and examples for each parameter</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Parameter</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Required</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Example</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Campaign Source</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Yes</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>google</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Use utm_source to identify a search engine, newsletter name, or other source.</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Campaign Medium</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Yes</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>cpc</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Use utm_medium to identify a medium such as email or cost-per-click.</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Campaign Name</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Yes</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>spring_sale</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Used for keyword analysis. Use utm_campaign to identify a specific product promotion or strategic campaign.</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Campaign Term</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>No</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>running+shoes</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Used for paid search. Use utm_term to note the keywords for this ad.</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Campaign Content</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>No</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>logolink</td>
                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Used for A/B testing. Use utm_content to differentiate ads or links that point to the same URL.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UTMForm; 
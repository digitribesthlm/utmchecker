import React, { useState } from 'react';
import Link from 'next/link';

const Admin = () => {
  const [utmParameters, setUtmParameters] = useState({
    sources: ['Google', 'Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'Email', 'Direct', 'Newsletter'],
    mediums: ['CPC', 'Email', 'Social', 'Organic', 'Referral', 'Display', 'Banner', 'PPC'],
    campaigns: ['summer_sale', 'black_friday', 'product_launch', 'winter_promotion', 'newsletter_jan']
  });

  const [newItem, setNewItem] = useState({
    sources: '',
    mediums: '',
    campaigns: ''
  });

  const handleInputChange = (type, value) => {
    setNewItem(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleAddParameter = (type) => {
    if (newItem[type].trim() !== '') {
      setUtmParameters(prev => ({
        ...prev,
        [type]: [...prev[type], newItem[type]]
      }));
      setNewItem(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  };

  const handleDeleteParameter = (type, index) => {
    setUtmParameters(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'var(--gray-100)', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>UTM Builder</h1>
        <nav>
          <Link href="/" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Home</Link>
          <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Admin</Link>
        </nav>
      </header>
      
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: 'var(--primary)' }}>Admin Dashboard</h1>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 16px', backgroundColor: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Back to UTM Generator
            </button>
          </Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Sources Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ color: 'var(--primary)' }}>Manage UTM Sources</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>Add or remove sources for your UTM parameters</p>
            
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Add new source"
                value={newItem.sources}
                onChange={(e) => handleInputChange('sources', e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '4px 0 0 4px', border: '1px solid var(--gray-300)', borderRight: 'none' }}
              />
              <button 
                onClick={() => handleAddParameter('sources')}
                style={{ padding: '10px', borderRadius: '0 4px 4px 0', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--gray-100)' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-300)' }}>Source</th>
                    <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid var(--gray-300)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {utmParameters.sources.map((source, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '10px', textAlign: 'left' }}>{source}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteParameter('sources', index)}
                          style={{ padding: '5px 10px', backgroundColor: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Mediums Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ color: 'var(--primary)' }}>Manage UTM Mediums</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>Add or remove mediums for your UTM parameters</p>
            
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Add new medium"
                value={newItem.mediums}
                onChange={(e) => handleInputChange('mediums', e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '4px 0 0 4px', border: '1px solid var(--gray-300)', borderRight: 'none' }}
              />
              <button 
                onClick={() => handleAddParameter('mediums')}
                style={{ padding: '10px', borderRadius: '0 4px 4px 0', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--gray-100)' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-300)' }}>Medium</th>
                    <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid var(--gray-300)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {utmParameters.mediums.map((medium, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '10px', textAlign: 'left' }}>{medium}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteParameter('mediums', index)}
                          style={{ padding: '5px 10px', backgroundColor: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Campaigns Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ color: 'var(--primary)' }}>Manage UTM Campaigns</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>Add or remove campaigns for tracking</p>
            
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Add new campaign"
                value={newItem.campaigns}
                onChange={(e) => handleInputChange('campaigns', e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '4px 0 0 4px', border: '1px solid var(--gray-300)', borderRight: 'none' }}
              />
              <button 
                onClick={() => handleAddParameter('campaigns')}
                style={{ padding: '10px', borderRadius: '0 4px 4px 0', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--gray-100)' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--gray-300)' }}>Campaign</th>
                    <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid var(--gray-300)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {utmParameters.campaigns.map((campaign, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '10px', textAlign: 'left' }}>{campaign}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteParameter('campaigns', index)}
                          style={{ padding: '5px 10px', backgroundColor: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', marginTop: '20px', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ color: 'var(--primary)' }}>UTM Usage Statistics</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>Overview of UTM parameter usage across your campaigns</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'var(--gray-100)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>Total Links</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>42</p>
            </div>
            <div style={{ backgroundColor: 'var(--gray-100)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>Top Source</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Google</p>
            </div>
            <div style={{ backgroundColor: 'var(--gray-100)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>Top Medium</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>CPC</p>
            </div>
            <div style={{ backgroundColor: 'var(--gray-100)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>Top Campaign</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>summer_sale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 
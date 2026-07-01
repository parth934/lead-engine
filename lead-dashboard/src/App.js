import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://lead-engine-backend-il3y.onrender.com/api/leads";

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTechFilter, setActiveTechFilter] = useState('ALL'); // NEW: Track active tech category

  // Form states
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  // Technology Categories for Filter Buttons
  const categories = [
    { label: '🌐 All Tech', value: 'ALL' },
    { label: '☕ Java / Spring', value: 'java' },
    { label: '🤖 AI / ML', value: 'python' },
    { label: '☁️ Cloud / DevOps', value: 'aws' },
    { label: '🛢️ Database', value: 'sql' },
    { label: '🧪 Testing / QA', value: 'testing' }
  ];

  // Handle Adding a Lead
  const handleAddLead = (e) => {
    e.preventDefault();
    const newLead = { 
      name: newName, 
      industry: newIndustry, 
      techStack: "Java", 
      employeeCount: 100, 
      isHiring: true 
    };
    
    axios.post(API_BASE_URL, newLead)
      .then(response => {
        setLeads([...leads, response.data]); 
        setNewName('');
        setNewIndustry('');
      })
      .catch(err => console.error("Could not add lead:", err));
  };

  // Handle Deleting a Lead
  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/${id}`)
      .then(() => {
        setLeads(leads.filter(lead => lead.id !== id)); 
      })
      .catch(err => console.error("Could not delete:", err));
  };

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(response => {
        setLeads(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Advanced Filtering Pipeline: Combines Search Query + Active Category Button
  const filteredLeads = leads.filter(company => {
    const matchesSearch = 
      company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      activeTechFilter === 'ALL' || 
      company.techStack?.toLowerCase().includes(activeTechFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#0f172a', 
      color: '#f8fafc', 
      minHeight: '100vh',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <h1 style={{ color: '#38bdf8', marginBottom: '10px' }}>B2B Lead Intelligence</h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Real-time domain filtering from Live Spring Boot Backend</p>
      
      {/* --- ADD NEW LEAD FORM --- */}
      <form onSubmit={handleAddLead} style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#1e293b', 
        borderRadius: '12px',
        display: 'flex',
        gap: '10px'
      }}>
        <input 
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', flex: 1 }}
          value={newName} 
          onChange={e => setNewName(e.target.value)} 
          placeholder="Company Name" 
          required 
        />
        <input 
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', flex: 1 }}
          value={newIndustry} 
          onChange={e => setNewIndustry(e.target.value)} 
          placeholder="Industry" 
          required 
        />
        <button type="submit" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#38bdf8', 
          color: '#0f172a', 
          fontWeight: 'bold', 
          borderRadius: '6px', 
          border: 'none',
          cursor: 'pointer'
        }}>
          + Add Lead
        </button>
      </form>

      {/* --- MULTI-CATEGORY FILTER BAR --- */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveTechFilter(cat.value)}
            style={{
              padding: '10px 18px',
              borderRadius: '20px',
              border: activeTechFilter === cat.value ? '2px solid #38bdf8' : '1px solid #334155',
              backgroundColor: activeTechFilter === cat.value ? '#38bdf8' : '#1e293b',
              color: activeTechFilter === cat.value ? '#0f172a' : '#f8fafc',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* --- SEARCH BAR --- */}
      <div style={{ marginBottom: '25px' }}>
        <input 
          style={{ 
            width: '100%', 
            padding: '12px 20px', 
            borderRadius: '8px', 
            border: '1px solid #334155', 
            backgroundColor: '#1e293b', 
            color: 'white',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍 Refine current filter by company name or industry..."
        />
      </div>
      
      {loading ? (
        <p>Loading leads from cloud network...</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredLeads.map((company) => {
            let statusColor = '#64748b'; 
            if (company.status === 'HOT') statusColor = '#ef4444'; 
            if (company.status === 'WARM') statusColor = '#f59e0b'; 

            return (
              <div key={company.id} style={{
                border: '1px solid #1e293b', 
                padding: '20px', 
                borderRadius: '12px', 
                backgroundColor: '#1e293b',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h2 style={{ margin: '0', fontSize: '1.5rem' }}>{company.name}</h2>
                    <span style={{
                      backgroundColor: statusColor,
                      color: '#ffffff',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {company.status || 'COLD'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ 
                      backgroundColor: company.score > 50 ? '#059669' : '#d97706',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      Score: {company.score}
                    </span>

                    <button 
                      onClick={() => handleDelete(company.id)}
                      style={{ 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p style={{ margin: '10px 0 0', color: '#94a3b8' }}>
                  <strong>Industry:</strong> {company.industry} | <strong>Tech:</strong> {company.techStack}
                </p>
              </div>
            );
          })}
          {filteredLeads.length === 0 && (
            <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>No records found matching this technology segment.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
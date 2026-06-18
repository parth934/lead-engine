import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Adding a Lead
  const handleAddLead = (e) => {
    e.preventDefault();
    const newLead = { 
      name: newName, 
      industry: newIndustry, 
      techStack: "Java", // Default for now
      employeeCount: 100, 
      isHiring: true 
    };
    
    axios.post("http://localhost:8080/api/leads", newLead)
      .then(response => {
        setLeads([...leads, response.data]); 
        setNewName('');
        setNewIndustry('');
      });
  };

  // Handle Deleting a Lead
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/leads/${id}`)
      .then(() => {
        setLeads(leads.filter(lead => lead.id !== id)); 
      })
      .catch(err => console.error("Could not delete:", err));
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/leads")
      .then(response => {
        setLeads(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const filteredLeads = leads.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#0f172a', 
      color: '#f8fafc', 
      minHeight: '100vh',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <h1 style={{ color: '#38bdf8', marginBottom: '10px' }}>B2B Lead Intelligence</h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Real-time scoring from Spring Boot Backend</p>
      
      {/* --- ADD NEW LEAD FORM --- */}
      <form onSubmit={handleAddLead} style={{ 
        marginBottom: '40px', 
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

      {/* --- SEARCH BAR START --- */}
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
          placeholder="🔍 Search leads by company name or industry..."
        />
      </div>
      {/* --- SEARCH BAR END --- */}
      
      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredLeads.map((company) => {
            // Dynamic color determination for the status tag
            let statusColor = '#64748b'; // COLD (Slate gray)
            if (company.status === 'HOT') statusColor = '#ef4444'; // HOT (Red)
            if (company.status === 'WARM') statusColor = '#f59e0b'; // WARM (Amber/Yellow)

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
                    
                    {/* --- STATUS SEGMENT BADGE --- */}
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
        </div>
      )}
    </div>
  );
}

export default App;
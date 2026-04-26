import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Make sure Spring Boot is running in IntelliJ on port 8080!
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
      
      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {leads.map((company, index) => (
            <div key={index} style={{ 
              border: '1px solid #1e293b', 
              padding: '20px', 
              borderRadius: '12px', 
              backgroundColor: '#1e293b',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '1.5rem' }}>{company.name}</h2>
                <span style={{ 
                  backgroundColor: company.score > 50 ? '#059669' : '#d97706',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  Score: {company.score}
                </span>
              </div>
              <p style={{ margin: '10px 0 0', color: '#94a3b8' }}>
                <strong>Industry:</strong> {company.industry} | <strong>Tech:</strong> {company.techStack}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
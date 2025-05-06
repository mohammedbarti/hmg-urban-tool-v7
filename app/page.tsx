
'use client';

import React, { useState } from 'react';

export default function Page() {
  const [population, setPopulation] = useState('');
  const [area, setArea] = useState('');
  const [density, setDensity] = useState('low');
  const [elderly, setElderly] = useState('');
  const [children, setChildren] = useState('');
  const [female, setFemale] = useState('');
  const [chronic, setChronic] = useState('');
  const [setting, setSetting] = useState('Urban');
  const [approach, setApproach] = useState('Single Stage');
  const [recommendations, setRecommendations] = useState([]);

  const calculate = () => {
    const pop = parseInt(population);
    const km2 = parseFloat(area);
    const el = parseInt(elderly);
    const ch = parseInt(children);
    const fem = parseInt(female);
    const cr = parseInt(chronic);
    const isUrban = setting === 'Urban';

    const amb = Math.max(
      Math.ceil(pop / 10000),
      Math.ceil(km2 / (isUrban ? 4 : 10))
    );
    const phc = Math.max(
      Math.ceil(pop / 10000),
      Math.ceil(km2 / 1.5)
    );
    const tele = Math.ceil(pop / 5000) + (el > 15 ? 1 : 0);
    const mobile = Math.ceil(km2 / 40) + (cr > 20 ? 1 : 0);
    const pods = (phc === 0 || amb === 0) ? 1 : 0;
    const women = fem > 60 ? 1 : 0;

    const items = [
      `🚑 AMBULANCES: ${amb} — Red Crescent: 1 per 10,000 or 4 km² urban / 10 km² rural`,
      `🏥 PHC: ${phc} — WHO Standard: 1 per 10,000 or 1.5 km²`,
      `👩‍💻 TELE: ${tele} — Digital Health: 1 per 5000 + elderly modifier`,
      `🆘 PODS: ${pods} — Fallback: If no PHC within 2km or Ambulance within 10km`,
      `🚐 MOBILE: ${mobile} — 1 per 40 km² + chronic illness modifier`,
      `🚺 WOMEN: ${women} — Vision 2030: Specialized access for high female ratio`
    ];

    setRecommendations(items);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <img src="/logo.png" alt="Logo" style={{ height: 40, marginBottom: '1rem' }} />
      <h1>HMG Urban Planning Tool</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 800 }}>
        <label>
          Population:
          <input type="number" value={population} onChange={e => setPopulation(e.target.value)} />
        </label>
        <label>
          Area (km²):
          <input type="number" value={area} onChange={e => setArea(e.target.value)} />
        </label>
        <label>
          Density:
          <select value={density} onChange={e => setDensity(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          % Elderly (60+):
          <input type="number" value={elderly} onChange={e => setElderly(e.target.value)} />
        </label>
        <label>
          % Children (under 18):
          <input type="number" value={children} onChange={e => setChildren(e.target.value)} />
        </label>
        <label>
          % Female:
          <input type="number" value={female} onChange={e => setFemale(e.target.value)} />
        </label>
        <label>
          % Chronic Illness:
          <input type="number" value={chronic} onChange={e => setChronic(e.target.value)} />
        </label>
        <label>
          Setting:
          <select value={setting} onChange={e => setSetting(e.target.value)}>
            <option value="Urban">Urban</option>
            <option value="Rural">Rural</option>
          </select>
        </label>
        <label>
          Deployment Approach:
          <select value={approach} onChange={e => setApproach(e.target.value)}>
            <option value="Single Stage">Single Stage</option>
            <option value="Phased 5-Year">Phased 5-Year</option>
          </select>
        </label>
      </div>

      <button onClick={calculate} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem' }}>Calculate</button>

      {recommendations.length > 0 && (
        <div className="recommendations" style={{ marginTop: '2rem' }}>
          <h2>Recommendations:</h2>
          <ul>
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
        Made by: Dr. Mohammed alBarti — Corporate Business Development
      </div>
    </div>
  );
}

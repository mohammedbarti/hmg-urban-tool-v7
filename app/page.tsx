
"use client";

import React, { useState } from 'react';

export default function UrbanPlanningTool() {
  const [inputs, setInputs] = useState({
    population: '',
    area: '',
    density: 'Low',
    elderly: '',
    children: '',
    female: '',
    chronic: '',
    setting: 'Urban',
    deploymentApproach: 'Single Stage'
  });
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const distributeOverYears = (count) => {
    const perYear = Math.floor(count / 5);
    const remainder = count % 5;
    return Array(5).fill(perYear).map((v, i) => i < remainder ? v + 1 : v);
  };

  const calculate = () => {
    const pop = parseInt(inputs.population);
    const area = parseFloat(inputs.area);
    const { density, elderly, children, female, chronic, setting, deploymentApproach } = inputs;
    const isRural = setting === 'Rural';

    let amb = Math.ceil(Math.max(pop / (isRural ? 5000 : 10000), area / (isRural ? 10 : 4)));
    let phc = Math.ceil(Math.max(pop / 10000, area / 1.5));
    let tele = Math.ceil(pop / 5000);
    let pods = (phc === 0 || amb === 0) ? 1 : 0;
    let mobile = Math.ceil(area / 40);
    let women = parseInt(female) > 60 ? 1 : 0;

    if (parseInt(elderly) > 15) tele += 1;
    if (parseInt(chronic) > 20) mobile += 1;
    if (parseInt(children) > 25) phc += 1;

    const final = [];

    const addRec = (emoji, label, count, ref) => {
      if (deploymentApproach === 'Phased 5-Year') {
        const phases = distributeOverYears(count);
        final.push(`${emoji} ${label.toUpperCase()}: ${count} — ${ref} — Phase 1–5: ${phases.join(', ')}`);
      } else {
        final.push(`${emoji} ${label.toUpperCase()}: ${count} — ${ref}`);
      }
    };

    addRec('🚑', 'Ambulances', amb, 'Red Crescent: 1 per 10,000 or 4 km² urban / 10 km² rural');
    addRec('🏥', 'PHC', phc, 'WHO Standard: 1 per 10,000 or 1.5 km²');
    addRec('📞', 'Tele', tele, 'Digital Health: 1 per 5000 + elderly modifier');
    addRec('🆘', 'Pods', pods, 'Fallback: If no PHC within 2km or Ambulance within 10km');
    addRec('🚐', 'Mobile', mobile, '1 per 40 km² + chronic illness modifier');
    addRec('🚺', 'Women', women, 'Vision 2030: Specialized access for high female ratio');

    setRecommendations(final);
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '2rem', textAlign: 'center' }}>
      <img src="/logo.png" alt="Logo" style={{ height: 50, marginBottom: '1rem' }} />
      <h1>HMG Urban Planning Tool</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        {[
          ['Population', 'population'],
          ['Area (km²)', 'area'],
          ['% Elderly (60+)', 'elderly'],
          ['% Children (under 18)', 'children'],
          ['% Female', 'female'],
          ['% Chronic Illness', 'chronic']
        ].map(([label, name]) => (
          <div key={name}>
            <label>{label}: <input type="number" name={name} value={inputs[name]} onChange={handleChange} /></label>
          </div>
        ))}
        <div>
          <label>Density:
            <select name="density" value={inputs.density} onChange={handleChange}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>
        </div>
        <div>
          <label>Setting:
            <select name="setting" value={inputs.setting} onChange={handleChange}>
              <option>Urban</option><option>Rural</option>
            </select>
          </label>
        </div>
        <div>
          <label>Deployment Approach:
            <select name="deploymentApproach" value={inputs.deploymentApproach} onChange={handleChange}>
              <option>Single Stage</option>
              <option>Phased 5-Year</option>
            </select>
          </label>
        </div>
      </div>

      <button onClick={calculate} style={{ padding: '0.5rem 1rem', fontSize: '16px' }}>Calculate</button>

      <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Recommendations:</h2>
        <ul>
          {recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
        </ul>
      </div>

      <div style={{ fontSize: '14px', color: '#666', marginTop: '2rem' }}>
        Made by: Dr. Mohammed alBarti – Corporate Business Development
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function UrbanPlanningTool() {
  const [inputs, setInputs] = useState({
    population: '',
    area: '',
    density: 'Low',
    elderly: '',
    children: '',
    chronic: '',
    female: '',
    setting: 'Urban',
    deployment: 'Single Stage'
  });

  const [recommendations, setRecommendations] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculate = () => {
    const population = parseInt(inputs.population);
    const area = parseFloat(inputs.area);
    const density = inputs.density;
    const setting = inputs.setting;
    const elderly = parseInt(inputs.elderly);
    const children = parseInt(inputs.children);
    const chronic = parseInt(inputs.chronic);
    const female = parseInt(inputs.female);
    const deployment = inputs.deployment;

    let amb = Math.max(
      Math.ceil(population / 10000),
      Math.ceil(area / (setting === 'Urban' ? 4 : 10))
    );

    let phc = Math.max(
      Math.ceil(population / 10000),
      Math.ceil(area / 1.5)
    );

    let tele = Math.ceil(population / 5000);
    if (elderly > 15) tele += 1;

    let pods = (phc === 0 || amb === 0) ? 1 : 0;

    let mobile = Math.ceil(area / 40);
    if (chronic > 20) mobile += 1;

    let women = female > 60 ? 1 : 0;

    let data = {
      amb,
      phc,
      tele,
      pods,
      mobile,
      women
    };

    if (deployment === 'Phased 5-Year') {
      const phases = { amb: [], phc: [], tele: [], pods: [], mobile: [], women: [] };
      Object.entries(data).forEach(([key, value]) => {
        const base = Math.floor(value / 5);
        const remainder = value % 5;
        for (let i = 0; i < 5; i++) {
          phases[key].push(i < remainder ? base + 1 : base);
        }
      });
      setRecommendations({ data, phases });
    } else {
      setRecommendations({ data });
    }
  };

  const exportToPDF = () => {
    const element = document.getElementById('pdf-content');
    html2pdf().from(element).save('HMG_Urban_Recommendations.pdf');
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '2rem' }}>
      <img src="/logo.png" alt="Logo" style={{ height: 50, marginBottom: 20 }} />
      <h1>HMG Urban Planning Tool</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '800px', margin: 'auto' }}>
        <input name="population" placeholder="Population" value={inputs.population} onChange={handleChange} />
        <input name="area" placeholder="Area (km²)" value={inputs.area} onChange={handleChange} />
        <select name="density" value={inputs.density} onChange={handleChange}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <input name="elderly" placeholder="% Elderly (60+)" value={inputs.elderly} onChange={handleChange} />
        <input name="children" placeholder="% Children (under 18)" value={inputs.children} onChange={handleChange} />
        <input name="chronic" placeholder="% Chronic Illness" value={inputs.chronic} onChange={handleChange} />
        <input name="female" placeholder="% Female" value={inputs.female} onChange={handleChange} />
        <select name="setting" value={inputs.setting} onChange={handleChange}>
          <option>Urban</option><option>Rural</option>
        </select>
        <select name="deployment" value={inputs.deployment} onChange={handleChange}>
          <option>Single Stage</option>
          <option>Phased 5-Year</option>
        </select>
      </div>

      <br />
      <button onClick={calculate}>Calculate</button>

      {recommendations && (
        <div id="pdf-content" style={{ marginTop: '2rem', maxWidth: '800px', margin: 'auto', textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center' }}>Recommendations:</h2>
          {inputs.deployment === 'Single Stage' ? (
            <ul>
              <li>🚑 <b>AMBULANCES:</b> {recommendations.data.amb} — <i>Red Crescent: 1 per 10,000 or 4 km² urban / 10 km² rural</i></li>
              <li>🏥 <b>PHC:</b> {recommendations.data.phc} — <i>WHO Standard: 1 per 10,000 or 1.5 km²</i></li>
              <li>☎️ <b>TELE:</b> {recommendations.data.tele} — <i>Digital Health: 1 per 5000 + elderly modifier</i></li>
              <li>🆘 <b>PODS:</b> {recommendations.data.pods} — <i>Fallback: If no PHC within 2km or Ambulance within 10km</i></li>
              <li>🚐 <b>MOBILE:</b> {recommendations.data.mobile} — <i>1 per 40 km² + chronic illness modifier</i></li>
              <li>🚺 <b>WOMEN:</b> {recommendations.data.women} — <i>Vision 2030: Specialized access for high female ratio</i></li>
            </ul>
          ) : (
            <div>
              {['amb', 'phc', 'tele', 'pods', 'mobile', 'women'].map(key => (
                <div key={key}>
                  <b>{key.toUpperCase()}:</b>
                  <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', gap: '1rem' }}>
                    {recommendations.phases[key].map((val, i) => (
                      <li key={i}>Phase {i + 1}: {val}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <button onClick={exportToPDF} style={{ marginTop: '1rem' }}>Export to PDF</button>
        </div>
      )}

      <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
        Made by: Dr. Mohammed alBarti – Corporate Business Development
      </div>
    </div>
  );
}

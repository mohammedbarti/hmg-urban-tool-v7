"use client";

import React, { useState } from 'react';

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

  const exportToPDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().from(element).save('HMG_Urban_Recommendations.pdf');
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '2rem' }}>
      <img src="/logo.png" alt="Logo" style={{ height: 60, marginBottom: 20 }} />
      <h1>HMG Urban Planning Tool</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', maxWidth: '1000px', margin: 'auto', alignItems: 'center' }}>
        <label>Population:<input type="number" name="population" value={inputs.population} onChange={handleChange} /></label>
        <label>Area (km²):<input type="number" name="area" value={inputs.area} onChange={handleChange} /></label>
        <label>Density:<select name="density" value={inputs.density} onChange={handleChange}><option>Low</option><option>Medium</option><option>High</option></select></label>
        <label>% Elderly (60+):<input type="number" name="elderly" value={inputs.elderly} onChange={handleChange} /></label>
        <label>% Children (under 18):<input type="number" name="children" value={inputs.children} onChange={handleChange} /></label>
        <label>% Chronic Illness:<input type="number" name="chronic" value={inputs.chronic} onChange={handleChange} /></label>
        <label>% Female:<input type="number" name="female" value={inputs.female} onChange={handleChange} /></label>
        <label>Setting:<select name="setting" value={inputs.setting} onChange={handleChange}><option>Urban</option><option>Rural</option></select></label>
        <label>Deployment Approach:<select name="deployment" value={inputs.deployment} onChange={handleChange}><option>Single Stage</option><option>Phased 5-Year</option></select></label>
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
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <b>{key.toUpperCase()}:</b>
                  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', listStyle: 'none', padding: 0, textAlign: 'center' }}>
                    {recommendations.phases[key].map((val, i) => (
                      <li key={i}><b>Phase {i + 1}:</b> {val}</li>
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

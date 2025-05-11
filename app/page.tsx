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
    walkability: '',
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
    const setting = inputs.setting;
    const elderly = parseInt(inputs.elderly);
    const children = parseInt(inputs.children);
    const chronic = parseInt(inputs.chronic);
    const female = parseInt(inputs.female);
    const walkability = parseInt(inputs.walkability);
    const deployment = inputs.deployment;

    let amb = Math.max(
      Math.ceil(population / 10000),
      Math.ceil(area / (setting === 'Urban' ? 4 : 10))
    );

    let phc = Math.ceil(population / 10000);
    if (walkability < 80) phc += 1;

    let tele = Math.ceil(population / 5000);
    if (elderly > 15) tele += 1;

    let pods = (phc === 0 || amb === 0) ? 1 : 0;

    let mobile = Math.ceil(area / 40);
    if (chronic > 20) mobile += 1;

    let women = female > 60 ? 1 : 0;
    let helipad = setting === 'Rural' ? 1 : 0;

    let data = { amb, phc, tele, pods, mobile, women, helipad };

    if (deployment === 'Phased 5-Year') {
      const phases = {};
      Object.entries(data).forEach(([key, value]) => {
        const base = Math.floor(value / 5);
        const remainder = value % 5;
        phases[key] = Array.from({ length: 5 }, (_, i) => i < remainder ? base + 1 : base);
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

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '2rem' }}>
      <img src="/logo.png" alt="Logo" style={{ height: 50, marginBottom: 20 }} />
      <h1>HMG Urban Planning Tool</h1>

      <form style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '900px', margin: 'auto', textAlign: 'left' }}>
        {[
          { label: 'Population', name: 'population' },
          { label: 'Area (km²)', name: 'area' },
          { label: '% Elderly (60+)', name: 'elderly' },
          { label: '% Children (under 18)', name: 'children' },
          { label: '% Chronic Illness', name: 'chronic' },
          { label: '% Female', name: 'female' },
          { label: 'Walkability Target (%)', name: 'walkability' }
        ].map(({ label, name }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
            <label>{label}</label>
            <input name={name} value={inputs[name]} onChange={handleChange} />
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label>Density</label>
          <select name="density" value={inputs.density} onChange={handleChange}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label>Setting</label>
          <select name="setting" value={inputs.setting} onChange={handleChange}>
            <option>Urban</option><option>Rural</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label>Deployment</label>
          <select name="deployment" value={inputs.deployment} onChange={handleChange}>
            <option>Single Stage</option>
            <option>Phased 5-Year</option>
          </select>
        </div>
      </form>

      <br />
      <button onClick={calculate}>Calculate</button>

      {recommendations && (
        <div id="pdf-content" style={{ marginTop: '2rem', maxWidth: '800px', margin: 'auto', textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center' }}>Recommendations:</h2>
          {inputs.deployment === 'Single Stage' ? (
            <ul>
              <li>🚑 <b>AMBULANCES:</b> {recommendations.data.amb} — <i>Red Crescent: 1 per 10,000 or 4–10 km²</i></li>
              <li>🏥 <b>PHC:</b> {recommendations.data.phc} — <i>WHO: 1 per 10,000 (+1 if walkability < 80%)</i></li>
              <li>☎️ <b>TELEHEALTH:</b> {recommendations.data.tele} — <i>Digital: 1 per 5,000 (+1 if elderly > 15%)</i></li>
              <li>🆘 <b>EMERGENCY POD:</b> {recommendations.data.pods} — <i>Fallback if no PHC or ambulance nearby</i></li>
              <li>🚐 <b>MOBILE CLINICS:</b> {recommendations.data.mobile} — <i>1 per 40 km² (+1 if chronic > 20%)</i></li>
              <li>🚺 <b>WOMEN'S HEALTH:</b> {recommendations.data.women} — <i>Trigger if female > 60%</i></li>
              {recommendations.data.helipad ? <li>✈️ <b>HELIPAD:</b> 1 — <i>For rural settings</i></li> : null}
            </ul>
          ) : (
            <ul>
              {Object.entries(recommendations.phases).map(([key, values]) => (
                <li key={key}>
                  <b>{emojiMap[key]} {key.toUpperCase()}:</b> {values.map((v, i) => `Phase ${i + 1}: ${v}`).join('  ')}
                </li>
              ))}
            </ul>
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

const emojiMap = {
  amb: '🚑',
  phc: '🏥',
  tele: '☎️',
  pods: '🆘',
  mobile: '🚐',
  women: '🚺',
  helipad: '✈️'
};

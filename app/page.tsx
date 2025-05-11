"use client";

import React, { useState } from 'react';

const emojiMap = {
  amb: '🚑',
  phc: '🏥',
  tele: '☎️',
  pods: '🆘',
  mobile: '🚐',
  women: '🚺',
  helipad: '✈️'
};

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

  const [recommendations, setRecommendations] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculate = () => {
    const population = parseInt(inputs.population);
    const area = parseFloat(inputs.area);
    const elderly = parseInt(inputs.elderly);
    const chronic = parseInt(inputs.chronic);
    const female = parseInt(inputs.female);
    const walkability = parseInt(inputs.walkability);
    const setting = inputs.setting;
    const deployment = inputs.deployment;

    let amb = Math.max(
      Math.ceil(population / 10000),
      Math.ceil(area / (setting === 'Urban' ? 4 : 10))
    );

    let phc = Math.ceil(population / 10000); // Area removed per your request

    let tele = Math.ceil(population / 5000);
    if (elderly > 15) tele += 1;

    let pods = (phc === 0 || amb === 0) ? 1 : 0;

    let mobile = Math.ceil(area / 40);
    if (chronic > 20) mobile += 1;

    let women = female > 60 ? 1 : 0;

    let helipad = setting === 'Rural' ? 1 : 0;

    let walkabilityWarning = walkability < 80;

    let data = { amb, phc, tele, pods, mobile, women, helipad, walkabilityWarning };

    if (deployment === 'Phased 5-Year') {
      const phases: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'number') {
          const base = Math.floor(value / 5);
          const remainder = value % 5;
          phases[key] = Array.from({ length: 5 }, (_, i) => i < remainder ? base + 1 : base);
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
      <img src="/logo.png" alt="Logo" style={{ height: 50, marginBottom: 20 }} />
      <h1>HMG Urban Planning Tool</h1>

      <form style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '900px', margin: 'auto' }}>
        {[
          { label: 'Population', name: 'population' },
          { label: 'Area (km²)', name: 'area' },
          { label: '% Elderly (60+)', name: 'elderly' },
          { label: '% Children (under 18)', name: 'children' },
          { label: '% Chronic Illness', name: 'chronic' },
          { label: '% Female', name: 'female' },
          { label: 'Walkability Target (%)', name: 'walkability' }
        ].map((field) => (
          <div key={field.name} style={{ textAlign: 'left' }}>
            <label>{field.label}</label><br />
            <input name={field.name} value={(inputs as any)[field.name]} onChange={handleChange} />
          </div>
        ))}

        <div>
          <label>Density</label><br />
          <select name="density" value={inputs.density} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label>Setting</label><br />
          <select name="setting" value={inputs.setting} onChange={handleChange}>
            <option>Urban</option>
            <option>Rural</option>
          </select>
        </div>

        <div>
          <label>Deployment</label><br />
          <select name="deployment" value={inputs.deployment} onChange={handleChange}>
            <option>Single Stage</option>
            <option>Phased 5-Year</option>
          </select>
        </div>
      </form>

      <br />
      <button onClick={calculate}>Calculate</button>

      {recommendations && (
        <div id="pdf-content" style={{ marginTop: '2rem', maxWidth: '900px', margin: 'auto', textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center' }}>Recommendations:</h2>

          {inputs.deployment === 'Single Stage' ? (
            <ul>
              <li>{emojiMap.amb} <b>AMBULANCES:</b> {recommendations.data.amb}</li>
              <li>{emojiMap.phc} <b>PHC:</b> {recommendations.data.phc}</li>
              <li>{emojiMap.tele} <b>TELE:</b> {recommendations.data.tele}</li>
              <li>{emojiMap.pods} <b>PODS:</b> {recommendations.data.pods}</li>
              <li>{emojiMap.mobile} <b>MOBILE:</b> {recommendations.data.mobile}</li>
              <li>{emojiMap.women} <b>WOMEN:</b> {recommendations.data.women}</li>
              {recommendations.data.helipad ? <li>{emojiMap.helipad} <b>HELIPAD:</b> 1 — Required for rural coverage</li> : null}
              {recommendations.data.walkabilityWarning ? <li>⚠️ <b>WALKABILITY:</b> Below 80% access — action required</li> : null}
            </ul>
          ) : (
            <ul>
              {Object.entries(recommendations.phases).map(([key, values]: any) => (
                <li key={key}>
                  <b>{emojiMap[key]} {key.toUpperCase()}:</b> {values.map((v: number, i: number) => `Phase ${i + 1}: ${v}`).join('  ')}
                </li>
              ))}
              {recommendations.data.walkabilityWarning ? <li>⚠️ <b>WALKABILITY:</b> Below 80% access — action required</li> : null}
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

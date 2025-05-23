'use client';

import React, { useState } from 'react';

type RecommendationData = {
  data: {
    amb: number;
    phc: number;
    tele: number;
    pods: number;
    mobile: number;
    women: number;
    helipad: number;
  };
  phases?: {
    [key: string]: number[];
  };
};

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
    setting: 'Urban',
    deployment: 'Single Stage'
  });

  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const deployment = inputs.deployment;

    let amb = Math.max(
      Math.ceil(population / 10000),
      Math.ceil(area / (setting === 'Urban' ? 4 : 10))
    );

    let phc = Math.ceil(population / 10000); // area removed

    let tele = Math.ceil(population / 5000);
    if (elderly > 15) tele += 1;

    let pods = (phc === 0 || amb === 0) ? 1 : 0;

    let mobile = Math.ceil(area / 40);
    if (chronic > 20) mobile += 1;

    let women = female > 60 ? 1 : 0;

    let helipad = setting === 'Rural' ? 1 : 0;

    const data = { amb, phc, tele, pods, mobile, women, helipad };

    if (deployment === 'Phased 5-Year') {
      const phases: { [key: string]: number[] } = {};
      Object.entries(data).forEach(([key, value]) => {
        const base = Math.floor(value / 5);
        const remainder = value % 5;
        phases[key] = Array.from({ length: 5 }, (_, i) => (i < remainder ? base + 1 : base));
      });
      setRecommendations({ data, phases });
    } else {
      setRecommendations({ data });
    }
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '2rem' }}>
      <img src="/logo.png" alt="Logo" style={{ height: 50, marginBottom: 20 }} />
      <h1>HMG Urban Planning Tool</h1>

      <form
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          maxWidth: '900px',
          margin: 'auto',
          alignItems: 'center'
        }}
      >
        {[
          { label: 'Population', name: 'population' },
          { label: 'Area (km²)', name: 'area' },
          { label: '% Elderly (60+)', name: 'elderly' },
          { label: '% Children (under 18)', name: 'children' },
          { label: '% Chronic Illness', name: 'chronic' },
          { label: '% Female', name: 'female' }
        ].map((field) => (
          <label key={field.name} style={{ display: 'flex', flexDirection: 'column' }}>
            {field.label}
            <input
              name={field.name}
              value={(inputs as any)[field.name]}
              onChange={handleChange}
            />
          </label>
        ))}

        <label>
          Density
          <select name="density" value={inputs.density} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label>
          Setting
          <select name="setting" value={inputs.setting} onChange={handleChange}>
            <option>Urban</option>
            <option>Rural</option>
          </select>
        </label>

        <label>
          Deployment Approach
          <select name="deployment" value={inputs.deployment} onChange={handleChange}>
            <option>Single Stage</option>
            <option>Phased 5-Year</option>
          </select>
        </label>
      </form>

      <br />
      <button onClick={calculate}>Calculate</button>

      {recommendations && (
        <div style={{ marginTop: '2rem', maxWidth: '800px', margin: 'auto', textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center' }}>Recommendations:</h2>

          {inputs.deployment === 'Single Stage' ? (
            <ul>
              <li>
                🚑 <b>AMBULANCES:</b> {recommendations.data.amb} —{' '}
                <i>Red Crescent: 1 per 10,000 or 4 km² urban / 10 km² rural</i>
              </li>
              <li>
                🏥 <b>PHC:</b> {recommendations.data.phc} —{' '}
                <i>WHO Standard: 1 per 10,000</i>
              </li>
              <li>
                ☎️ <b>TELE:</b> {recommendations.data.tele} —{' '}
                <i>Digital Health: 1 per 5000 + elderly modifier</i>
              </li>
              <li>
                🆘 <b>PODS:</b> {recommendations.data.pods} —{' '}
                <i>Fallback: If no PHC within 2km or Ambulance within 10km</i>
              </li>
              <li>
                🚐 <b>MOBILE:</b> {recommendations.data.mobile} —{' '}
                <i>1 per 40 km² + chronic illness modifier</i>
              </li>
              <li>
                🚺 <b>WOMEN:</b> {recommendations.data.women} —{' '}
                <i>Vision 2030: Specialized access for high female ratio</i>
              </li>
              {recommendations.data.helipad ? (
                <li>
                  ✈️ <b>HELIPAD:</b> 1 — <i>Required for rural coverage</i>
                </li>
              ) : null}
            </ul>
          ) : (
            <ul>
              {Object.entries(recommendations.phases || {}).map(([key, values]) => (
                <li key={key}>
                  <b>{emojiMap[key as keyof typeof emojiMap]} {key.toUpperCase()}:</b>{' '}
                  {values.map((v, i) => `Phase ${i + 1}: ${v}`).join('  ')}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
        Made by: Dr. Mohammed alBarti – Corporate Business Development
      </div>
    </div>
  );
}

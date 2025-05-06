
'use client';
import React, { useState } from 'react';

const Page = () => {
  const [population, setPopulation] = useState('');
  const [area, setArea] = useState('');
  const [density, setDensity] = useState('medium');
  const [elderly, setElderly] = useState('');
  const [children, setChildren] = useState('');
  const [female, setFemale] = useState('');
  const [chronic, setChronic] = useState('');
  const [setting, setSetting] = useState('urban');
  const [approach, setApproach] = useState('single');
  const [results, setResults] = useState(null);

  const calculate = () => {
    const pop = parseInt(population);
    const km2 = parseFloat(area);
    const eld = parseFloat(elderly);
    const child = parseFloat(children);
    const fem = parseFloat(female);
    const chron = parseFloat(chronic);

    const ambulances = Math.ceil(Math.max(pop / 10000, km2 / (setting === 'urban' ? 4 : 10)));
    const phc = Math.ceil(Math.max(pop / 10000, km2 / 1.5));
    const tele = Math.ceil(pop / 5000 + (eld > 15 ? 1 : 0));
    const pods = (pop > 20000 || km2 > 2 || (!phc && !ambulances)) ? 1 : 0;
    const mobile = Math.ceil(km2 / 40) + (chron > 20 ? 1 : 0);
    const women = fem > 60 ? 1 : 0;

    const perYear = (count: number) => {
      const base = Math.floor(count / 5);
      const mod = count % 5;
      return Array.from({ length: 5 }, (_, i) => base + (i < mod ? 1 : 0));
    };

    setResults({
      ambulances: { total: ambulances, perYear: perYear(ambulances), justification: "Red Crescent: 1 per 10,000 or 4 km² urban / 10 km² rural" },
      phc: { total: phc, perYear: perYear(phc), justification: "WHO Standard: 1 per 10,000 or 1.5 km²" },
      tele: { total: tele, perYear: perYear(tele), justification: "Digital Health: 1 per 5000 + elderly modifier" },
      pods: { total: pods, perYear: perYear(pods), justification: "Fallback: If no PHC within 2km or Ambulance within 10km" },
      mobile: { total: mobile, perYear: perYear(mobile), justification: "1 per 40 km² + chronic illness modifier" },
      women: { total: women, perYear: perYear(women), justification: "Vision 2030: Specialized access for high female ratio" },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
      <h1>HMG Urban Planning Tool</h1>

      <div>
        <label>Population:</label><input value={population} onChange={e => setPopulation(e.target.value)} />
        <label>Area (km²):</label><input value={area} onChange={e => setArea(e.target.value)} />
        <label>Density:</label><select value={density} onChange={e => setDensity(e.target.value)}>
          <option>low</option><option>medium</option><option>high</option>
        </select>
        <label>% Elderly (60+):</label><input value={elderly} onChange={e => setElderly(e.target.value)} />
        <label>% Children (under 18):</label><input value={children} onChange={e => setChildren(e.target.value)} />
        <label>% Female:</label><input value={female} onChange={e => setFemale(e.target.value)} />
        <label>% Chronic Illness:</label><input value={chronic} onChange={e => setChronic(e.target.value)} />
        <label>Setting:</label><select value={setting} onChange={e => setSetting(e.target.value)}>
          <option value="urban">Urban</option><option value="rural">Rural</option>
        </select>
        <label>Deployment Approach:</label><select value={approach} onChange={e => setApproach(e.target.value)}>
          <option value="single">Single Stage</option><option value="phased">Phased (5 Years)</option>
        </select>
        <button onClick={calculate}>Calculate</button>
      </div>

      {results && (
        <div>
          <h3>Recommendations:</h3>
          {Object.entries(results).map(([key, val]: any) => (
            <div key={key}>
              <strong>{key.toUpperCase()}:</strong> {val.total}  
              <em> — {val.justification}</em><br/>
              {approach === 'phased' && <ul>{val.perYear.map((y: number, i: number) => <li key={i}>Year {i + 1}: {y}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 10, right: 20, fontSize: '14px', color: '#666' }}>
        Made by: Dr. Mohammed AlBarti – Corporate Business Development
      </div>
    </div>
  );
};

export default Page;

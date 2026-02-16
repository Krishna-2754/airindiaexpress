import React, { useState, useEffect } from 'react';
import { AIRLINES } from './config';

export default function App() {
  const [page, setPage] = useState('admin'); // admin, search, success
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- PAGE 1: ADMIN SELECTION ---
  if (page === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <h1 className="text-4xl font-bold mb-4 italic text-blue-400 font-mono">JUSPAY DEMO OPS</h1>
        <p className="mb-10 text-slate-400">Select an airline persona to launch the flight search demo</p>
        <div className="flex gap-8">
          {Object.values(AIRLINES).map((a) => (
            <button key={a.id} onClick={() => { setAirline(a); setPage('search'); }} 
              className="bg-white text-black p-6 rounded-2xl w-48 hover:scale-105 transition shadow-2xl">
              <img src={a.logo} alt={a.name} className="h-10 mx-auto object-contain mb-4" />
              <div className="font-bold border-t pt-2">{a.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- PAGE 2: BRANDED FLIGHT SEARCH ---
  if (page === 'search') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header style={{ backgroundColor: airline.primary, color: airline.text }} className="p-4 shadow-lg flex justify-between items-center">
          <img src={airline.logo} className="h-8" alt="logo" />
          <button onClick={() => setPage('admin')} className="text-sm opacity-70 border-b border-current">Exit Demo</button>
        </header>
        
        <main className="max-w-4xl mx-auto py-10 px-4">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex gap-4 items-end">
             <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase">From</label>
                <input type="text" className="w-full border-b-2 p-2 focus:outline-none" defaultValue="Direct Flights Only" />
             </div>
             <button style={{ backgroundColor: airline.primary, color: airline.text }} className="px-10 py-3 rounded font-bold">Search</button>
          </div>

          <h3 className="text-xl font-bold mb-4">Select Outbound Flight</h3>
          {airline.flights.map(f => (
            <div key={f.id} className="bg-white mb-4 rounded-lg shadow-md flex overflow-hidden border-l-4" style={{borderColor: airline.secondary}}>
              <div className="p-6 flex-1">
                <div className="text-sm font-bold text-gray-400 mb-1">{f.id}</div>
                <div className="text-2xl font-black">{f.time} <span className="text-sm font-normal text-gray-400 mx-2">─────</span> {f.from} → {f.to}</div>
              </div>
              <div className="bg-gray-50 p-6 flex flex-col items-center justify-center border-l">
                <div className="text-2xl font-bold mb-2">₹{f.price.toLocaleString()}</div>
                <button 
                  onClick={async () => {
                    setLoading(true);
                    const res = await fetch('/create-session', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ amount: f.price, airlineName: airline.name })
                    });
                    const data = await res.json();
                    window.location.href = data.url;
                  }}
                  style={{ backgroundColor: airline.primary, color: airline.text }}
                  className="px-6 py-2 rounded-full font-bold shadow-md"
                >
                  {loading ? "Redirecting..." : "BOOK"}
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // --- PAGE 3: SUCCESS (Triggered after Juspay Return) ---
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-10">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-4xl">✓</div>
      <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
      <p className="text-gray-500 mt-2">Your payment via Juspay was successful.</p>
      <button onClick={() => setPage('admin')} className="mt-8 px-6 py-2 bg-blue-600 text-white rounded">Back to Admin Panel</button>
    </div>
  );
}
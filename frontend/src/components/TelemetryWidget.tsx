import React, { useState, useEffect } from 'react';
import { Activity, Gauge, Thermometer, Droplets, Zap } from 'lucide-react';

export const TelemetryWidget: React.FC = () => {
  const [telemetry, setTelemetry] = useState({
    rpm: 45.0,
    temp: 28.2,
    humidity: 62.0,
    fps: 60.0,
    pressure: 90.0,
    status: 'OPTIMAL'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        rpm: Number((45.0 + (Math.random() * 2 - 1)).toFixed(1)),
        temp: Number((28.0 + (Math.random() * 0.8 - 0.4)).toFixed(1)),
        humidity: Number((62.0 + (Math.random() * 2 - 1)).toFixed(1)),
        fps: Number((59.8 + (Math.random() * 0.4)).toFixed(1)),
        pressure: Number((90.0 + (Math.random() * 1.5 - 0.75)).toFixed(1)),
        status: 'OPTIMAL'
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="font-semibold text-slate-100">Live Conveyor & Sensor Telemetry</h3>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ● {telemetry.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Gauge className="w-4 h-4 text-blue-400" />
            <span>Speed</span>
          </div>
          <p className="text-xl font-bold text-white">{telemetry.rpm} <span className="text-xs text-slate-400">RPM</span></p>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Temp</span>
          </div>
          <p className="text-xl font-bold text-white">{telemetry.temp}°C</p>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <p className="text-xl font-bold text-white">{telemetry.humidity}%</p>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Camera</span>
          </div>
          <p className="text-xl font-bold text-white">{telemetry.fps} <span className="text-xs text-slate-400">FPS</span></p>
        </div>
      </div>
    </div>
  );
};

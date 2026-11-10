'use client';
import { motion } from 'framer-motion';
import { RiskBadge } from './RiskBadge';

export function ScoreGauge({ score = 0, level, compact = false }) {
  const color = score > 60 ? '#c33b3b' : score > 30 ? '#ad6900' : '#157a52';
  const normalized = Math.max(0, Math.min(100, score));
  return <div className={`flex ${compact ? 'gap-3' : 'flex-col'} items-center ${compact ? '' : 'text-center'}`}><div className="relative grid h-28 w-28 place-items-center" aria-label={`Risk screening score ${normalized} out of 100`}><svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="48" fill="none" stroke="#e8edf5" strokeWidth="9" /><motion.circle cx="60" cy="60" r="48" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="301.6" initial={{ strokeDashoffset: 301.6 }} animate={{ strokeDashoffset: 301.6 * (1 - normalized / 100) }} transition={{ duration: .8, ease: 'easeOut' }} /></svg><span className="text-3xl font-black tracking-tight text-ink">{normalized}</span></div><div className={compact ? '' : 'mt-2'}><p className="text-xs font-bold uppercase tracking-widest text-muted">Screening score</p>{level && <div className="mt-1"><RiskBadge level={level} /></div>}</div></div>;
}

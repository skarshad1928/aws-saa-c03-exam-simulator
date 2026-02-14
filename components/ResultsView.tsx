
import React from 'react';
import { Question, Domain } from '../types';

interface ResultsViewProps {
  questions: Question[];
  userAnswers: Record<string, number[]>;
  onRetake: () => void;
  onReview: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ questions, userAnswers, onRetake, onReview }) => {
  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      const answers = userAnswers[q.id] || [];
      const isCorrect = q.correctAnswers.length === answers.length && 
                        q.correctAnswers.every(v => answers.includes(v));
      if (isCorrect) correctCount++;
    });
    
    const percentage = correctCount / questions.length;
    const scaledScore = Math.round(100 + (percentage * 900));
    return { scaledScore, correctCount, percentage };
  };

  const getDomainStats = () => {
    const stats: Record<string, { total: number; correct: number }> = {};
    Object.values(Domain).forEach(d => stats[d] = { total: 0, correct: 0 });

    questions.forEach(q => {
      stats[q.domain].total++;
      const answers = userAnswers[q.id] || [];
      const isCorrect = q.correctAnswers.length === answers.length && 
                        q.correctAnswers.every(v => answers.includes(v));
      if (isCorrect) stats[q.domain].correct++;
    });

    return stats;
  };

  const { scaledScore, correctCount, percentage } = calculateScore();
  const isPass = scaledScore >= 720;
  const domainStats = getDomainStats();

  // Radar Chart Logic
  const domains = Object.entries(domainStats);
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  
  const points = domains.map(([_, data], i) => {
    const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
    const scorePerc = data.total > 0 ? data.correct / data.total : 0;
    const x = centerX + radius * scorePerc * Math.cos(angle);
    const y = centerY + radius * scorePerc * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const bgPoints = domains.map((_, i) => {
    const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className={`p-10 rounded-3xl text-center shadow-xl border-4 ${isPass ? 'bg-white border-green-500' : 'bg-white border-red-500'}`}>
          <div className={`inline-block px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-4 ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPass ? 'Exam Passed' : 'Exam Failed'}
          </div>
          <h1 className={`text-6xl font-black mb-2 ${isPass ? 'text-green-600' : 'text-red-600'}`}>{scaledScore}</h1>
          <p className="text-slate-500 font-medium mb-8">Passing Score: 720 / 1000</p>
          
          <div className="flex justify-center gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">{correctCount}/{questions.length}</div>
              <div className="text-xs uppercase font-bold text-slate-400">Correct Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">{Math.round(percentage * 100)}%</div>
              <div className="text-xs uppercase font-bold text-slate-400">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800 mb-6 w-full">Domain Performance Chart</h3>
            <div className="relative w-[300px] h-[300px]">
              <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                {/* Background Polygons */}
                {[0.2, 0.4, 0.6, 0.8, 1].map(r => (
                  <polygon
                    key={r}
                    points={domains.map((_, i) => {
                      const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
                      return `${centerX + radius * r * Math.cos(angle)},${centerY + radius * r * Math.sin(angle)}`;
                    }).join(' ')}
                    className="fill-none stroke-slate-100"
                    strokeWidth="1"
                  />
                ))}
                {/* Axis lines */}
                {domains.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
                  return (
                    <line
                      key={i}
                      x1={centerX}
                      y1={centerY}
                      x2={centerX + radius * Math.cos(angle)}
                      y2={centerY + radius * Math.sin(angle)}
                      className="stroke-slate-100"
                    />
                  );
                })}
                {/* Actual Score Polygon */}
                <polygon
                  points={points}
                  className={`${isPass ? 'fill-green-500/20 stroke-green-500' : 'fill-blue-500/20 stroke-blue-500'}`}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Labels */}
                {domains.map(([name, _], i) => {
                  const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
                  const x = centerX + (radius + 25) * Math.cos(angle);
                  const y = centerY + (radius + 25) * Math.sin(angle);
                  const anchor = Math.abs(x - centerX) < 10 ? 'middle' : x < centerX ? 'end' : 'start';
                  return (
                    <text
                      key={i}
                      x={x}
                      y={y}
                      fontSize="10"
                      fontWeight="600"
                      textAnchor={anchor}
                      className="fill-slate-500 uppercase tracking-tighter"
                    >
                      {name.split(': ')[0]}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Domain Breakdown</h3>
              {domains.map(([name, data]) => {
                const perc = data.total > 0 ? (data.correct / data.total) * 100 : 0;
                return (
                  <div key={name} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-600 truncate mr-2">{name}</span>
                      <span className={`text-xs font-black ${perc >= 72 ? 'text-green-600' : 'text-slate-500'}`}>{Math.round(perc)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${perc >= 72 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${perc}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-8 flex flex-col gap-3">
              <button
                onClick={onReview}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
              >
                Review Items & Explanations
              </button>
              <button
                onClick={onRetake}
                className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-all"
              >
                Start Different Random Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;


import React from 'react';
import { Question } from '../types';

interface NavigationPanelProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, number[]>;
  marked: Set<string>;
  onNavigate: (index: number) => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
  questions,
  currentIndex,
  userAnswers,
  marked,
  onNavigate
}) => {
  return (
    <div className="bg-white border-r border-slate-200 h-full overflow-y-auto p-4 w-72 flex flex-col">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Question Grid</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isAnswered = (userAnswers[q.id]?.length || 0) > 0;
          const isMarked = marked.has(q.id);
          const isCurrent = currentIndex === idx;

          let bgColor = "bg-slate-50";
          let textColor = "text-slate-600";
          let borderColor = "border-slate-200";

          if (isCurrent) {
            borderColor = "border-blue-600";
            bgColor = "bg-blue-50";
            textColor = "text-blue-700 font-bold";
          } else if (isMarked) {
            bgColor = "bg-orange-100";
            textColor = "text-orange-700";
            borderColor = "border-orange-300";
          } else if (isAnswered) {
            bgColor = "bg-green-100";
            textColor = "text-green-700";
            borderColor = "border-green-300";
          }

          return (
            <button
              key={q.id}
              onClick={() => onNavigate(idx)}
              className={`w-10 h-10 flex items-center justify-center rounded border transition-all hover:shadow-sm ${bgColor} ${textColor} ${borderColor}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-50 border border-slate-200"></div>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-300"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-100 border border-orange-300"></div>
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-50 border-2 border-blue-600"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;


import React from 'react';
import { Question } from '../types';

interface QuestionDisplayProps {
  question: Question;
  index: number;
  total: number;
  selectedAnswers: number[];
  onAnswer: (options: number[]) => void;
  isMarked: boolean;
  onToggleMark: () => void;
  showExplanation?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  index,
  total,
  selectedAnswers,
  onAnswer,
  isMarked,
  onToggleMark,
  showExplanation = false
}) => {
  const toggleOption = (idx: number) => {
    if (showExplanation) return;
    
    if (question.type === "SINGLE") {
      onAnswer([idx]);
    } else {
      const newAnswers = selectedAnswers.includes(idx)
        ? selectedAnswers.filter(a => a !== idx)
        : [...selectedAnswers, idx];
      onAnswer(newAnswers);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{question.domain}</span>
            <h2 className="text-2xl font-bold text-slate-800">Question {index + 1} of {total}</h2>
          </div>
          <button
            onClick={onToggleMark}
            className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors ${
              isMarked ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isMarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
            {isMarked ? 'Marked' : 'Mark for Review'}
          </button>
        </div>

        <div className="prose prose-slate lg:prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
          {question.scenario}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-500 mb-2">
            {question.type === "SINGLE" ? "Select the best answer:" : `Select ${question.correctAnswers.length} correct answers:`}
          </p>
          {question.options.map((opt, idx) => {
            const isSelected = selectedAnswers.includes(idx);
            const isCorrect = question.correctAnswers.includes(idx);
            
            let borderStyle = "border-slate-200 hover:border-blue-400";
            let bgStyle = "bg-white";
            let checkboxStyle = "border-slate-300";

            if (showExplanation) {
              if (isCorrect) {
                borderStyle = "border-green-500 ring-1 ring-green-500";
                bgStyle = "bg-green-50";
                checkboxStyle = "bg-green-500 border-green-500";
              } else if (isSelected) {
                borderStyle = "border-red-500";
                bgStyle = "bg-red-50";
                checkboxStyle = "bg-red-500 border-red-500";
              }
            } else if (isSelected) {
              borderStyle = "border-blue-600 ring-1 ring-blue-600";
              bgStyle = "bg-blue-50";
              checkboxStyle = "bg-blue-600 border-blue-600";
            }

            return (
              <button
                key={idx}
                onClick={() => toggleOption(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 ${borderStyle} ${bgStyle}`}
              >
                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded ${question.type === "SINGLE" ? 'rounded-full' : 'rounded'} border-2 flex items-center justify-center ${checkboxStyle}`}>
                  {isSelected && <div className={`w-2 h-2 ${question.type === "SINGLE" ? 'rounded-full' : 'rounded'} bg-white`}></div>}
                </div>
                <span className="text-slate-800 leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
            <h4 className="font-bold text-blue-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Explanation
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;

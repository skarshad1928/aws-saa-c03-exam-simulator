
import React, { useState, useEffect, useCallback } from 'react';
import { EXAM_SETS } from './data/questions';
import { ExamSet, UserAnswer, Question } from './types';
import Timer from './components/Timer';
import NavigationPanel from './components/NavigationPanel';
import QuestionDisplay from './components/QuestionDisplay';
import ResultsView from './components/ResultsView';

type ViewMode = 'START' | 'EXAM' | 'RESULTS' | 'REVIEW';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('START');
  const [currentSet, setCurrentSet] = useState<ExamSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [isTimeUp, setIsTimeUp] = useState(false);

  const startRandomExam = useCallback(() => {
    // Pick a truly random set from the 5 available
    const randomIndex = Math.floor(Math.random() * EXAM_SETS.length);
    const randomSet = EXAM_SETS[randomIndex];
    
    // Shuffle the questions in the selected set for even more variety
    const shuffledQuestions = [...randomSet.questions].sort(() => Math.random() - 0.5);
    
    setCurrentSet({
      ...randomSet,
      questions: shuffledQuestions
    });
    
    setCurrentIndex(0);
    setUserAnswers({});
    setMarked(new Set());
    setView('EXAM');
    setIsTimeUp(false);
  }, []);

  const handleFinish = () => {
    setView('RESULTS');
  };

  if (view === 'START') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-12 text-white text-center">
            <div className="inline-block bg-orange-500 p-3 rounded-lg mb-6 shadow-lg shadow-orange-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">AWS CERTIFIED</h1>
            <p className="text-orange-400 font-bold uppercase tracking-widest text-sm">Solutions Architect – Associate (SAA-C03)</p>
          </div>
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl font-black text-slate-800">50</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl font-black text-slate-800">130</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minutes</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Exam Simulator Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 font-medium">
                {['5 Unique Question Sets', 'Domain-Wise Analytics', 'Scaled Scoring (100-1000)', 'Radar Chart Visualization', 'Full Explanations', 'Scenario-Based Questions'].map((feat, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <svg className="text-green-500 shrink-0" width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={startRandomExam}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
            >
              Start Simulator
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentSet) {
    const isReview = view === 'REVIEW';

    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Header Bar - Hidden Set Info */}
        <header className="h-16 bg-slate-900 text-white px-6 flex items-center justify-between shrink-0 shadow-lg z-10">
          <div className="flex items-center gap-4">
            <span className="font-black text-sm tracking-widest border-l-4 border-orange-500 pl-4 uppercase">SAA-C03 SIMULATOR</span>
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Candidate Mode: Active Session</span>
          </div>
          {!isReview && (
            <Timer initialMinutes={130} onTimeUp={() => { setIsTimeUp(true); handleFinish(); }} />
          )}
          <div className="flex items-center gap-3">
            {isReview ? (
              <button
                onClick={() => setView('RESULTS')}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm font-bold transition-all"
              >
                Exit Review
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm("End exam and calculate score?")) handleFinish();
                }}
                className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded text-sm font-black transition-all shadow-lg shadow-orange-500/20"
              >
                END EXAM
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <NavigationPanel
            questions={currentSet.questions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            marked={marked}
            onNavigate={(idx) => setCurrentIndex(idx)}
          />

          {view === 'RESULTS' ? (
            <ResultsView 
              questions={currentSet.questions} 
              userAnswers={userAnswers} 
              onRetake={startRandomExam}
              onReview={() => {
                setView('REVIEW');
                setCurrentIndex(0);
              }}
            />
          ) : (
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
              <QuestionDisplay
                question={currentSet.questions[currentIndex]}
                index={currentIndex}
                total={currentSet.questions.length}
                selectedAnswers={userAnswers[currentSet.questions[currentIndex].id] || []}
                onAnswer={(opts) => setUserAnswers(prev => ({ ...prev, [currentSet.questions[currentIndex].id]: opts }))}
                isMarked={marked.has(currentSet.questions[currentIndex].id)}
                onToggleMark={() => setMarked(prev => {
                  const next = new Set(prev);
                  if (next.has(currentSet.questions[currentIndex].id)) next.delete(currentSet.questions[currentIndex].id);
                  else next.add(currentSet.questions[currentIndex].id);
                  return next;
                })}
                showExplanation={isReview}
              />

              <div className="h-20 border-t border-slate-100 bg-slate-50/50 px-8 flex items-center justify-between shrink-0">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Previous
                </button>
                <div className="text-slate-400 font-black text-xs uppercase tracking-widest">
                  Progress: {Math.round(((currentIndex + 1) / currentSet.questions.length) * 100)}%
                </div>
                <button
                  disabled={currentIndex === currentSet.questions.length - 1}
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className={`px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all ${
                    currentIndex === currentSet.questions.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'
                  }`}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default App;

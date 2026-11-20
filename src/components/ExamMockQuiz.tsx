import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { QuizQuestion } from '../types/study';
import { INITIAL_QUIZ_QUESTIONS } from '../data/defaultChapters';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Layers,
  Award,
  Plus
} from 'lucide-react';

export const ExamMockQuiz: React.FC = () => {
  const { activeDocument, addFlashcard, language } = useStudy();
  const isHinglish = language === 'hinglish';

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    return INITIAL_QUIZ_QUESTIONS['doc-physics-1'] || [];
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min
  const [timerActive, setTimerActive] = useState(false);
  const [flashcardsCreated, setFlashcardsCreated] = useState<Record<number, boolean>>({});

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && !isSubmitted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && !isSubmitted && timerActive) {
      handleSubmitQuiz();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isSubmitted, timerSeconds]);

  const handleGenerateQuiz = async () => {
    if (!activeDocument) return;
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setFlashcardsCreated({});

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: activeDocument.title,
          content: activeDocument.content,
          highlights: activeDocument.highlights.map(h => h.text),
          count: 5
        })
      });

      if (!res.ok) throw new Error('Quiz generation failed');
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setTimerSeconds(data.questions.length * 60); // 1 min per question
        setTimerActive(true);
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      // Fallback to pre-built questions if available
      const fallback = INITIAL_QUIZ_QUESTIONS[activeDocument.id] || INITIAL_QUIZ_QUESTIONS['doc-physics-1'];
      setQuestions(fallback);
      setTimerSeconds(fallback.length * 60);
      setTimerActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
    if (!timerActive) setTimerActive(true);
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setTimerActive(false);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    if (percentage >= 60) {
      // Trigger festive confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
    setTimerSeconds(questions.length * 60);
    setTimerActive(true);
    setFlashcardsCreated({});
  };

  const handleMakeCardFromMistake = (qIdx: number) => {
    const q = questions[qIdx];
    if (!q || flashcardsCreated[qIdx]) return;

    addFlashcard({
      documentId: activeDocument?.id || 'doc-physics-1',
      front: `Exam Question: ${q.question}`,
      back: `Correct Answer: "${q.options[q.correctIndex]}"\n\nExplanation: ${q.explanation}`,
      category: 'Quiz Error Revision'
    });

    setFlashcardsCreated(prev => ({ ...prev, [qIdx]: true }));
  };

  // Score calculation
  const totalCorrect = questions.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length;
  const scorePercent = Math.round((totalCorrect / Math.max(1, questions.length)) * 100);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {isHinglish ? 'Exam Mock Practice Test' : 'Exam Practice Mock Quiz'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {isHinglish
              ? 'Syllabus aur highlights par mabni questions se apni tayari parakhein.'
              : 'Simulate high-yield examination questions extracted from chapter highlights.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="tabular-nums">{formatTimer(timerSeconds)}</span>
          </div>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateQuiz}
            disabled={isLoading || !activeDocument}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50 shadow-xs"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {isLoading
                ? (isHinglish ? 'Questions ban rahe hain...' : 'Generating...')
                : (isHinglish ? 'Naya AI Test Banayein' : 'Generate New Test')}
            </span>
          </button>
        </div>
      </div>

      {!isSubmitted ? (
        /* Active Test Taking View */
        questions.length > 0 && currentQ ? (
          <div className="mt-6 space-y-6">
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span>·</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-[11px] text-slate-700 dark:text-slate-300">
                  {currentQ.conceptTag}
                </span>
                <span>·</span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  {currentQ.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-6 h-6 rounded-md font-mono text-xs font-semibold transition-colors ${
                      i === currentIdx
                        ? 'bg-amber-500 text-white'
                        : selectedAnswers[i] !== undefined
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {currentQ.question}
              </p>

              {/* 4 Choices */}
              <div className="space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 ring-1 ring-amber-500 font-medium'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed pt-0.5">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                {isHinglish ? 'Pichla Sawal' : 'Previous'}
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-xs"
                  >
                    {isHinglish ? 'Agla Sawal' : 'Next Question'}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
                  >
                    {isHinglish ? 'Test Submit Karein' : 'Submit Practice Test'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl mt-6">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isHinglish ? 'Test Tayar Karein' : 'No Active Test'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {isHinglish
                ? 'AI se current chapter aur highlights ke mutabiq practice questions generate karein.'
                : 'Generate a customized mock exam quiz from your selected reading chapter.'}
            </p>
            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
            >
              {isHinglish ? 'Test Shuru Karein' : 'Start Practice Test'}
            </button>
          </div>
        )
      ) : (
        /* Test Results & Detailed Review View */
        <div className="mt-6 space-y-6 animate-in fade-in duration-300">
          {/* Score Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {scorePercent >= 80
                ? (isHinglish ? 'Shaandar Taiyari! (Excellent Mastery)' : 'Outstanding Mastery!')
                : scorePercent >= 60
                ? (isHinglish ? 'Achi Koshish! (Good Progress)' : 'Solid Attempt!')
                : (isHinglish ? 'Revision Ki Zaroorat Hai (Needs Review)' : 'More Review Needed')}
            </h3>

            <div className="my-3 flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                {totalCorrect} / {questions.length}
              </span>
              <span className="text-base text-slate-600 dark:text-slate-400 font-semibold font-mono">
                ({scorePercent}%)
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {isHinglish
                ? 'Neeche diye gaye har sawal ka sahi jawab aur explanation zaroor parhein taake exam mein galti na ho.'
                : 'Review the detailed explanations below to eliminate gaps before the real examination.'}
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHinglish ? 'Dobara Test Dein' : 'Retake Quiz'}</span>
              </button>
              <button
                onClick={handleGenerateQuiz}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHinglish ? 'Naya Set Generate Karein' : 'Generate New Questions'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {isHinglish ? 'Har Sawal Ka Analysis & Hal' : 'Detailed Question Analysis'}
            </h3>

            {questions.map((q, idx) => {
              const userChoice = selectedAnswers[idx];
              const isCorrect = userChoice === q.correctIndex;
              const hasCreatedCard = flashcardsCreated[idx];

              return (
                <div
                  key={q.id || idx}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 transition-all ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/50'
                      : 'border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {q.conceptTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <XCircle className="w-4 h-4" />
                            <span>Incorrect</span>
                          </span>
                          <button
                            onClick={() => handleMakeCardFromMistake(idx)}
                            disabled={hasCreatedCard}
                            className="px-2 py-1 text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-100 transition-colors flex items-center gap-1"
                            title="Turn this mistake into a flashcard for active recall"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{hasCreatedCard ? 'Flashcard Added!' : '+ Make Flashcard'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <p className="mt-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                    {q.question}
                  </p>

                  {/* Choices outcome */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctIndex;
                      const isOptionSelected = userChoice === oIdx;

                      let style = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                      if (isOptionCorrect) {
                        style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 line-through';
                      }

                      return (
                        <div key={oIdx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${style}`}>
                          <span className="font-mono font-bold shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* High-yield explanation */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-slate-100 block mb-1 font-bold">
                      {isHinglish ? 'Tafseel & Examiner Tip:' : 'Concept Explanation:'}
                    </strong>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

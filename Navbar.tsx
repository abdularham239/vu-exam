import React from 'react';
import { useStudy } from '../context/StudyContext';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Lightbulb,
  Layers,
  Award,
  Zap,
  Timer,
  Sun,
  Moon,
  Plus,
  Languages
} from 'lucide-react';

interface NavbarProps {
  onOpenNewChapter: () => void;
  onOpenPomodoro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewChapter, onOpenPomodoro }) => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    pomodoro,
    importantQuestions,
    conceptVault
  } = useStudy();

  const isHinglish = language === 'hinglish';

  const formatPomoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('reader')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-base transition-transform group-hover:scale-105">
                M
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 block">
                  Medha Study Studio
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 tracking-wide block -mt-0.5">
                  {isHinglish ? 'Parhai, Questions & Concepts' : 'Study, Questions & Concept Vault'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveTab('reader')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'reader'
                  ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isHinglish ? 'Study & Highlight' : 'Reader'}</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'notes'
                  ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isHinglish ? 'Notes' : 'Cornell Notes'}</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'questions'
                  ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>{isHinglish ? 'Important Sawal' : 'Important Questions'}</span>
              <span className="text-[10px] opacity-75 font-mono">({importantQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('concepts')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'concepts'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHinglish ? 'Concept Clarity' : 'Concept Vault'}</span>
              <span className="text-[10px] opacity-75 font-mono">({conceptVault.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'flashcards'
                  ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isHinglish ? 'Flashcards' : 'Active Recall'}</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isHinglish ? 'Mock Quiz' : 'Test'}</span>
            </button>

            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'cheatsheet'
                  ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isHinglish ? '1-Page Sheet' : 'Cheat Sheet'}</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action + utility buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Pomodoro Quick Badge */}
            <button
              onClick={onOpenPomodoro}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                pomodoro.isRunning
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
              title="Pomodoro Focus Timer"
            >
              <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="tabular-nums font-semibold">{formatPomoTime(pomodoro.timeLeft)}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(isHinglish ? 'english' : 'hinglish')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1"
              title="Toggle Hinglish / English"
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-semibold uppercase">{language}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewChapter}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHinglish ? '+ Naya Chapter' : '+ Add Material'}</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>
        </div>

        {/* Medium and Mobile Navigation bar */}
        <div className="flex lg:hidden items-center gap-2 py-2 border-t border-slate-200 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap shrink-0 ${activeTab === 'reader' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Study
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap shrink-0 ${activeTab === 'notes' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap shrink-0 ${activeTab === 'questions' ? 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Questions ({importantQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap shrink-0 ${activeTab === 'concepts' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Clarity Vault ({conceptVault.length})
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap shrink-0 ${activeTab === 'flashcards' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap shrink-0 ${activeTab === 'quiz' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap shrink-0 ${activeTab === 'cheatsheet' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            CheatSheet
          </button>
        </div>
      </div>
    </header>
  );
};

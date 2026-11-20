import React from 'react';
import { useStudy } from '../context/StudyContext';
import {
  Menu,
  Search,
  Timer,
  Columns,
  Maximize2,
  Plus,
  BookOpen,
  FileText,
  HelpCircle,
  Lightbulb,
  Layers,
  Award,
  Zap
} from 'lucide-react';

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenNewChapter: () => void;
  onOpenCommandPalette: () => void;
  splitView: boolean;
  onToggleSplitView: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleMobileSidebar,
  onOpenNewChapter,
  onOpenCommandPalette,
  splitView,
  onToggleSplitView
}) => {
  const { activeTab, activeDocument, language, pomodoro } = useStudy();
  const isHinglish = language === 'hinglish';

  const tabTitles: Record<string, { en: string; ur: string }> = {
    reader: { en: 'Study Reader', ur: 'Active Study & Highlighting' },
    notes: { en: 'Cornell Notes', ur: 'Cornell Exam Notes' },
    questions: { en: 'Important Questions', ur: 'Aham Exam Sawalaat' },
    concepts: { en: 'Concept Clarity Vault', ur: 'Concept Clarity Vault' },
    flashcards: { en: 'Active Recall', ur: 'Flashcards Practice' },
    quiz: { en: 'Practice Mock Test', ur: 'Exam Mock Quiz' },
    cheatsheet: { en: '1-Page Cheat Sheet', ur: '1-Page Rapid Revision' }
  };

  const currentTabTitle = tabTitles[activeTab] || { en: 'Workspace', ur: 'Workspace' };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clean Unboxed Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            {activeDocument?.subject || 'Workspace'}
          </span>
          <span aria-hidden="true" className="opacity-40">/</span>
          <span className="truncate max-w-[150px] sm:max-w-xs font-medium text-slate-600 dark:text-slate-300">
            {activeDocument?.title || 'General'}
          </span>
          <span aria-hidden="true" className="opacity-40 hidden sm:inline">/</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold hidden sm:inline">
            {isHinglish ? currentTabTitle.ur : currentTabTitle.en}
          </span>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Split Screen Toggle (Only active on Reader tab for dual mode) */}
        {activeTab === 'reader' && (
          <button
            onClick={onToggleSplitView}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              splitView
                ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
            title="Toggle Split-Screen Mode (Read + Take Notes side-by-side)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isHinglish ? (splitView ? 'Dual Mode ON' : 'Dual Split Mode') : (splitView ? 'Split View' : 'Split View')}</span>
          </button>
        )}

        {/* Quick Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline font-mono text-[9px] bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenNewChapter}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-2xs whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHinglish ? '+ Naya Chapter' : '+ Material'}</span>
        </button>
      </div>
    </header>
  );
};

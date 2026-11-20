import React from 'react';
import { useStudy, ActiveTab } from '../context/StudyContext';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Lightbulb,
  Layers,
  Award,
  Zap,
  Plus,
  Search,
  Timer,
  Play,
  Pause,
  Sun,
  Moon,
  Languages,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenNewChapter: () => void;
  onOpenCommandPalette: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenNewChapter,
  onOpenCommandPalette
}) => {
  const {
    activeTab,
    setActiveTab,
    documents,
    activeDocId,
    setActiveDocId,
    importantQuestions,
    conceptVault,
    flashcards,
    pomodoro,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    exportAllData
  } = useStudy();

  const isHinglish = language === 'hinglish';

  const formatPomoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const navItems: {
    id: ActiveTab;
    label: string;
    hinglishLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
    group: 'study' | 'vault' | 'practice';
  }[] = [
    {
      id: 'reader',
      label: 'Study Reader',
      hinglishLabel: 'Study & Highlight',
      icon: BookOpen,
      badge: documents.find(d => d.id === activeDocId)?.highlights.length || 0,
      badgeColor: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300',
      group: 'study'
    },
    {
      id: 'notes',
      label: 'Cornell Notes',
      hinglishLabel: 'Cornell Notes',
      icon: FileText,
      group: 'study'
    },
    {
      id: 'questions',
      label: 'Important Questions',
      hinglishLabel: 'Important Sawal',
      icon: HelpCircle,
      badge: importantQuestions.length,
      badgeColor: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300',
      group: 'vault'
    },
    {
      id: 'concepts',
      label: 'Concept Clarity',
      hinglishLabel: 'Concept Vault',
      icon: Lightbulb,
      badge: conceptVault.length,
      badgeColor: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300',
      group: 'vault'
    },
    {
      id: 'flashcards',
      label: 'Active Recall',
      hinglishLabel: 'Flashcards',
      icon: Layers,
      badge: flashcards.length,
      badgeColor: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300',
      group: 'practice'
    },
    {
      id: 'quiz',
      label: 'Mock Exam Test',
      hinglishLabel: 'Taiyari Quiz',
      icon: Award,
      group: 'practice'
    },
    {
      id: 'cheatsheet',
      label: '1-Page Cheat Sheet',
      hinglishLabel: '1-Page Revision',
      icon: Zap,
      group: 'practice'
    }
  ];

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none ${
        collapsed ? 'w-16' : 'w-64 sm:w-68'
      }`}
    >
      {/* Top Header & Logo */}
      <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              M
            </div>
            <div className="truncate">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight block truncate">
                Medha Studio
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block tracking-wide -mt-0.5">
                {isHinglish ? 'Exam Taiyari Platform' : 'Exam Study Workspace'}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm mx-auto">
            M
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden lg:block"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Middle Scrollable Section */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 no-scrollbar">
        {/* Quick Add Button */}
        {!collapsed ? (
          <button
            onClick={onOpenNewChapter}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHinglish ? '+ Naya Chapter / Material' : '+ Add Study Material'}</span>
          </button>
        ) : (
          <button
            onClick={onOpenNewChapter}
            className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center mx-auto transition-transform hover:scale-105"
            title="Add Study Material"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Quick Search Launcher */}
        {!collapsed ? (
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-600" />
              <span>{isHinglish ? 'Search (⌘K)...' : 'Quick Jump...'}</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
              ⌘K
            </kbd>
          </button>
        ) : (
          <button
            onClick={onOpenCommandPalette}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-400"
            title="Search (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Group 1: Study & Read */}
        <div className="space-y-1">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-2.5 block">
              {isHinglish ? 'Padhai & Notes' : 'Study & Notes'}
            </span>
          )}
          {navItems
            .filter(item => item.group === 'study')
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-100/90 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{isHinglish ? item.hinglishLabel : item.label}</span>}
                  </div>
                  {!collapsed && item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Group 2: Exam Vault */}
        <div className="space-y-1">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-2.5 block">
              {isHinglish ? 'Exam Vault' : 'Exam Vault'}
            </span>
          )}
          {navItems
            .filter(item => item.group === 'vault')
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-100/90 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{isHinglish ? item.hinglishLabel : item.label}</span>}
                  </div>
                  {!collapsed && item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Group 3: Practice & Revise */}
        <div className="space-y-1">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-2.5 block">
              {isHinglish ? 'Taiyari & Test' : 'Practice & Revise'}
            </span>
          )}
          {navItems
            .filter(item => item.group === 'practice')
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-100/90 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{isHinglish ? item.hinglishLabel : item.label}</span>}
                  </div>
                  {!collapsed && item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Chapter Quick Switcher */}
        {!collapsed && documents.length > 0 && (
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-2.5 block">
              {isHinglish ? 'Active Chapters' : 'Saved Chapters'}
            </span>
            {documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveDocId(doc.id);
                  setActiveTab('reader');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] truncate block transition-colors ${
                  doc.id === activeDocId && activeTab === 'reader'
                    ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800'
                }`}
                title={doc.title}
              >
                <span className="text-[9px] text-amber-600 dark:text-amber-400 uppercase font-bold mr-1">
                  {doc.subject}
                </span>
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sticky Workspace Card */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3 bg-slate-50/60 dark:bg-slate-900/60">
        {/* Pomodoro Focus Mini Widget */}
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Timer className="w-3.5 h-3.5 text-amber-500" />
                <span>{isHinglish ? 'Focus Session' : 'Pomodoro'}</span>
              </span>
              <span className="font-mono text-xs font-bold tabular-nums text-amber-600 dark:text-amber-400">
                {formatPomoTime(pomodoro.timeLeft)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1">
              <button
                onClick={pomodoro.isRunning ? pomodoro.pause : pomodoro.start}
                className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 text-white ${
                  pomodoro.isRunning ? 'bg-slate-800 dark:bg-slate-700' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {pomodoro.isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{pomodoro.isRunning ? 'Pause' : 'Focus'}</span>
              </button>
              <button
                onClick={pomodoro.reset}
                className="px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-700 rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={pomodoro.isRunning ? pomodoro.pause : pomodoro.start}
            className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mx-auto"
            title={pomodoro.isRunning ? 'Pause Focus' : 'Start Focus'}
          >
            {pomodoro.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}

        {/* Utilities Bar: Language, Dark Mode, Backup */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'} text-xs text-slate-600 dark:text-slate-400`}>
          <button
            onClick={() => setLanguage(isHinglish ? 'english' : 'hinglish')}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 font-mono text-[11px] font-bold"
            title="Toggle Hinglish / English"
          >
            <Languages className="w-3.5 h-3.5" />
            {!collapsed && <span className="uppercase">{language}</span>}
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          <button
            onClick={exportAllData}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Backup JSON Data"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
          </button>
        </div>
      </div>
    </aside>
  );
};

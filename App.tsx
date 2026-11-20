import React, { useState, useEffect } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CommandPalette } from './components/CommandPalette';
import { StudyReader } from './components/StudyReader';
import { ExamNotesWorkspace } from './components/ExamNotesWorkspace';
import { ImportantQuestionsBank } from './components/ImportantQuestionsBank';
import { ConceptClarityVault } from './components/ConceptClarityVault';
import { FlashcardStudySession } from './components/FlashcardStudySession';
import { ExamMockQuiz } from './components/ExamMockQuiz';
import { ExamCheatSheet } from './components/ExamCheatSheet';
import { PomodoroModal } from './components/PomodoroModal';
import { NewChapterModal } from './components/NewChapterModal';
import { Download, Upload, ShieldCheck, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, language, exportAllData, importAllData } = useStudy();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [splitView, setSplitView] = useState(false);

  const isHinglish = language === 'hinglish';

  // Global Keyboard Shortcuts (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const success = importAllData(text);
        if (success) {
          alert(isHinglish ? 'Data kamyabi se restore ho gaya!' : 'Data restored successfully!');
        } else {
          alert(isHinglish ? 'File format ghalat hai.' : 'Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {/* Desktop Collapsible Left Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenNewChapter={() => setShowNewChapter(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 flex-1 max-w-xs w-full bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
            <div className="absolute top-3 right-3 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              onOpenNewChapter={() => {
                setMobileSidebarOpen(false);
                setShowNewChapter(true);
              }}
              onOpenCommandPalette={() => {
                setMobileSidebarOpen(false);
                setShowCommandPalette(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Contextual Header */}
        <TopHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenNewChapter={() => setShowNewChapter(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          splitView={splitView}
          onToggleSplitView={() => setSplitView(!splitView)}
        />

        {/* Tab View Stages */}
        <main className="flex-1">
          {activeTab === 'reader' && (
            <StudyReader
              onOpenNewChapter={() => setShowNewChapter(true)}
              splitView={splitView}
            />
          )}
          {activeTab === 'notes' && <ExamNotesWorkspace />}
          {activeTab === 'questions' && <ImportantQuestionsBank />}
          {activeTab === 'concepts' && <ConceptClarityVault />}
          {activeTab === 'flashcards' && <FlashcardStudySession />}
          {activeTab === 'quiz' && <ExamMockQuiz />}
          {activeTab === 'cheatsheet' && <ExamCheatSheet />}
        </main>

        {/* Compact Workspace Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-4 px-4 sm:px-6 mt-8 no-print text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Medha Study Studio
              </span>
              <span aria-hidden="true">·</span>
              <span>{isHinglish ? 'Exam Taiyari & Concept Clarity Vault' : 'Exam Study & Concept Clarity Vault'}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHinglish ? 'Browser Mein Mehfooz' : 'Offline-Safe'}</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={exportAllData}
                className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title="Download JSON backup"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isHinglish ? 'Export Data' : 'Export Data'}</span>
              </button>

              <label className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{isHinglish ? 'Import Data' : 'Import'}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
      {showNewChapter && (
        <NewChapterModal onClose={() => setShowNewChapter(false)} />
      )}
      {showPomodoro && (
        <PomodoroModal onClose={() => setShowPomodoro(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainLayout />
    </StudyProvider>
  );
}

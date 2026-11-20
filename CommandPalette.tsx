import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { ActiveTab } from '../context/StudyContext';
import {
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  Lightbulb,
  Layers,
  Award,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const {
    documents,
    setActiveDocId,
    notes,
    setActiveNoteId,
    importantQuestions,
    conceptVault,
    setActiveTab,
    language
  } = useStudy();

  const isHinglish = language === 'hinglish';
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchingDocs = documents.filter(d =>
    d.title.toLowerCase().includes(q) || d.subject.toLowerCase().includes(q)
  );

  const matchingQuestions = importantQuestions.filter(iq =>
    iq.question.toLowerCase().includes(q) || iq.subject.toLowerCase().includes(q)
  );

  const matchingConcepts = conceptVault.filter(cv =>
    cv.concept.toLowerCase().includes(q) || cv.easyExplanation.toLowerCase().includes(q)
  );

  const matchingNotes = notes.filter(n =>
    n.title.toLowerCase().includes(q) || n.notes.toLowerCase().includes(q)
  );

  const navigateTo = (tab: ActiveTab, action?: () => void) => {
    setActiveTab(tab);
    if (action) action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isHinglish ? 'Chapter, question, concept ya note dhoondein...' : 'Search chapters, questions, concepts, notes...'}
            className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 text-xs">
          {/* Quick Navigation Commands */}
          {!q && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                {isHinglish ? 'Quick Sections' : 'Quick Navigation'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => navigateTo('reader')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium truncate">Study Reader</span>
                </button>
                <button
                  onClick={() => navigateTo('questions')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-medium truncate">Important Questions</span>
                </button>
                <button
                  onClick={() => navigateTo('concepts')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium truncate">Concept Vault</span>
                </button>
                <button
                  onClick={() => navigateTo('notes')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-500" />
                  <span className="font-medium truncate">Cornell Notes</span>
                </button>
                <button
                  onClick={() => navigateTo('flashcards')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span className="font-medium truncate">Flashcards</span>
                </button>
                <button
                  onClick={() => navigateTo('cheatsheet')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-medium truncate">Exam Cheat Sheet</span>
                </button>
              </div>
            </div>
          )}

          {/* Chapters */}
          {matchingDocs.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-2 block">
                {isHinglish ? 'Syllabus & Chapters' : 'Chapters'}
              </span>
              {matchingDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => navigateTo('reader', () => setActiveDocId(doc.id))}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {doc.title}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">
                        {doc.subject} · {doc.highlights.length} highlights
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Important Questions */}
          {matchingQuestions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 px-2 block">
                {isHinglish ? 'Important Exam Sawalaat' : 'Important Questions'}
              </span>
              {matchingQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => navigateTo('questions')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {q.question}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">
                        {q.subject} · {q.marks} Marks · {q.questionType}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Concept Vault */}
          {matchingConcepts.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-2 block">
                {isHinglish ? 'Concept Clarity Items' : 'Concept Vault'}
              </span>
              {matchingConcepts.map((cv) => (
                <button
                  key={cv.id}
                  onClick={() => navigateTo('concepts')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {cv.concept}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate block">
                        {cv.easyExplanation.slice(0, 70)}...
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {q && matchingDocs.length === 0 && matchingQuestions.length === 0 && matchingConcepts.length === 0 && matchingNotes.length === 0 && (
            <div className="py-8 text-center text-slate-600 dark:text-slate-400">
              <p className="font-medium">{isHinglish ? 'Koi natija nahi mila.' : 'No matching items found.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

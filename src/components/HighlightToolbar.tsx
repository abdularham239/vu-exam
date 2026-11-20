import React, { useState } from 'react';
import { HighlightCategory, HIGHLIGHT_CATEGORIES } from '../types/study';
import { Sparkles, FileText, Plus, MessageSquare, HelpCircle, Lightbulb } from 'lucide-react';

interface HighlightToolbarProps {
  position: { top: number; left: number };
  selectedText: string;
  onApplyHighlight: (category: HighlightCategory, noteText?: string) => void;
  onExplainConcept: (text: string) => void;
  onSendToNote: (text: string, category: HighlightCategory) => void;
  onMakeFlashcard: (text: string) => void;
  onSaveAsQuestion?: (text: string) => void;
  onSaveToVault?: (text: string) => void;
  onClose: () => void;
  isHinglish?: boolean;
}

export const HighlightToolbar: React.FC<HighlightToolbarProps> = ({
  position,
  selectedText,
  onApplyHighlight,
  onExplainConcept,
  onSendToNote,
  onMakeFlashcard,
  onSaveAsQuestion,
  onSaveToVault,
  onClose,
  isHinglish = false
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [activeCategory, setActiveCategory] = useState<HighlightCategory>('core');

  const categories: HighlightCategory[] = ['core', 'formula', 'exam', 'example', 'quick_fact'];

  const handleSelectCategory = (cat: HighlightCategory) => {
    setActiveCategory(cat);
    if (!showNoteInput) {
      onApplyHighlight(cat, '');
    }
  };

  const handleSaveWithNote = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyHighlight(activeCategory, noteText);
    onClose();
  };

  return (
    <div
      style={{
        top: `${Math.max(10, position.top - 65)}px`,
        left: `${Math.max(16, Math.min(window.innerWidth - 440, position.left - 200))}px`,
      }}
      className="fixed z-50 animate-in fade-in zoom-in-95 duration-150 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl rounded-xl p-2 flex flex-col gap-2 max-w-md"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {!showNoteInput ? (
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Color Category Pickers */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
            {categories.map((catKey) => {
              const meta = HIGHLIGHT_CATEGORIES[catKey];
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => handleSelectCategory(catKey)}
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: meta.dotColor }}
                  title={`${isHinglish ? meta.hinglishLabel : meta.label}`}
                >
                  <span className="sr-only">{meta.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Quick Note Toggle */}
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
            title={isHinglish ? 'Margin Note likhein' : 'Add Margin Note'}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-medium hidden sm:inline">Note</span>
          </button>

          {/* AI Explainer Button */}
          <button
            type="button"
            onClick={() => onExplainConcept(selectedText)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            title={isHinglish ? 'AI se asaan alfaaz mein samjhein' : 'Explain simply with AI'}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{isHinglish ? 'Samjhao' : 'Explain'}</span>
          </button>

          {/* Save as Important Question */}
          {onSaveAsQuestion && (
            <button
              type="button"
              onClick={() => onSaveAsQuestion(selectedText)}
              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs flex items-center gap-1 transition-colors"
              title={isHinglish ? 'Important Sawal Mein Save Karein' : 'Save as Important Question'}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Save to Concept Vault */}
          {onSaveToVault && (
            <button
              type="button"
              onClick={() => onSaveToVault(selectedText)}
              className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-xs flex items-center gap-1 transition-colors"
              title={isHinglish ? 'Concept Clarity Vault Mein Dalein' : 'Save to Concept Vault'}
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Send to Notes */}
          <button
            type="button"
            onClick={() => onSendToNote(selectedText, activeCategory)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
            title={isHinglish ? 'Notes mein shamil karein' : 'Send to Cornell Notes'}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Turn into Flashcard */}
          <button
            type="button"
            onClick={() => onMakeFlashcard(selectedText)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
            title={isHinglish ? 'Flashcard banayein' : 'Make Flashcard'}
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSaveWithNote} className="flex flex-col gap-2 p-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {isHinglish ? 'Margin Note / Yaad Dihani' : 'Add Margin Note'}:
            </span>
            <div className="flex items-center gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`w-3.5 h-3.5 rounded-full transition-transform ${activeCategory === c ? 'scale-125 ring-2 ring-slate-400' : 'opacity-60'}`}
                  style={{ backgroundColor: HIGHLIGHT_CATEGORIES[c].dotColor }}
                />
              ))}
            </div>
          </div>
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={isHinglish ? 'e.g. Exam mein 3 marks ka ata hai...' : 'e.g. Crucial derivation step...'}
            autoFocus
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowNoteInput(false)}
              className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-xs"
            >
              Save Highlight
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

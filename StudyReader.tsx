import React, { useState, useRef, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { HighlightToolbar } from './HighlightToolbar';
import { ConceptExplainerModal } from './ConceptExplainerModal';
import { HighlightCategory, HIGHLIGHT_CATEGORIES, Highlight } from '../types/study';
import {
  Highlighter,
  Search,
  BookOpen,
  Sparkles,
  Eye,
  Trash2,
  FileText,
  Plus,
  Layers,
  ChevronDown
} from 'lucide-react';

interface StudyReaderProps {
  onOpenNewChapter: () => void;
  splitView?: boolean;
}

export const StudyReader: React.FC<StudyReaderProps> = ({ onOpenNewChapter, splitView = false }) => {
  const {
    documents,
    activeDocId,
    activeDocument,
    setActiveDocId,
    addHighlight,
    removeHighlight,
    insertHighlightIntoNote,
    addFlashcard,
    addImportantQuestion,
    addConceptVaultItem,
    notes,
    activeNote,
    updateNote,
    createNote,
    language,
    setActiveTab
  } = useStudy();

  const isHinglish = language === 'hinglish';
  const [splitTab, setSplitTab] = useState<'notes' | 'highlights'>('notes');

  // Selection & Toolbar state
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  // Reader Settings
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<HighlightCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Modal
  const [explainingConcept, setExplainingConcept] = useState<string | null>(null);

  // Chapter dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Handle Text Selection for Highlighting
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setToolbarPosition(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 3) {
      setToolbarPosition(null);
      setSelectedText('');
      return;
    }

    // Verify selection is inside reader content container
    if (contentRef.current && contentRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setToolbarPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
  };

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setToolbarPosition(null);
    setSelectedText('');
  };

  const handleApplyHighlight = (category: HighlightCategory, noteText?: string) => {
    if (!activeDocument || !selectedText) return;
    addHighlight(activeDocument.id, {
      text: selectedText,
      category,
      noteText
    });
    clearSelection();
  };

  const handleSendToNote = (text: string, category: HighlightCategory) => {
    if (!activeDocument) return;
    const hl = addHighlight(activeDocument.id, { text, category });
    insertHighlightIntoNote(hl);
    clearSelection();
  };

  const handleMakeFlashcard = (text: string) => {
    if (!activeDocument) return;
    addFlashcard({
      documentId: activeDocument.id,
      front: `Key Concept: "${text.length > 80 ? text.slice(0, 80) + '...' : text}"`,
      back: `Exam Summary: From chapter "${activeDocument.title}". Review definitions and conditions.`,
      category: 'Reader Highlight'
    });
    clearSelection();
  };

  const handleSaveAsQuestion = (text: string) => {
    if (!activeDocument) return;
    addImportantQuestion({
      question: `Explain and discuss: "${text}"`,
      subject: activeDocument.subject,
      chapterTitle: activeDocument.title,
      marks: 5,
      questionType: 'conceptual',
      importance: 'very_high',
      modelAnswer: `1. Definition & Core Meaning:\n${text}\n\n2. Key Step / Principle:\nDerived directly from "${activeDocument.title}".\n\n3. Exam Marking Criteria:\nState the exact governing conditions, definitions, and SI units.`,
      status: 'to_practice'
    });
    clearSelection();
    alert(isHinglish ? 'Sawal Important Questions Bank mein save ho gaya!' : 'Saved to Important Questions Bank!');
  };

  const handleSaveToVault = (text: string) => {
    if (!activeDocument) return;
    addConceptVaultItem({
      concept: text.length > 60 ? text.slice(0, 60) + '...' : text,
      subject: activeDocument.subject,
      chapterTitle: activeDocument.title,
      easyExplanation: text,
      analogy: `Think of this principle as a foundational rule in ${activeDocument.subject}.`,
      whyConfusing: 'Students frequently miss the underlying boundary conditions during numerical questions.',
      keyRulesOrFormula: 'Check standard units and sign conventions.',
      clarityLevel: 'getting_there'
    });
    clearSelection();
    alert(isHinglish ? 'Concept Clarity Vault mein save ho gaya!' : 'Saved to Concept Clarity Vault!');
  };

  // Render highlighted content
  const renderFormattedContent = () => {
    if (!activeDocument) return null;

    const highlights = activeDocument.highlights || [];
    const content = activeDocument.content;

    // Filter highlights if a category is selected
    const activeHls = categoryFilter === 'all'
      ? highlights
      : highlights.filter(h => h.category === categoryFilter);

    // Split paragraphs
    const paragraphs = content.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      // Check headers
      if (para.startsWith('## ')) {
        return (
          <h2
            key={pIdx}
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-6 mb-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80"
          >
            {para.replace('## ', '')}
          </h2>
        );
      }
      if (para.startsWith('### ')) {
        return (
          <h3
            key={pIdx}
            className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2"
          >
            {para.replace('### ', '')}
          </h3>
        );
      }
      if (para.startsWith('---')) {
        return <hr key={pIdx} className="my-6 border-slate-200 dark:border-slate-800" />;
      }

      // Check bullet items
      if (para.startsWith('- ')) {
        const items = para.split('\n');
        return (
          <ul key={pIdx} className="list-disc pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300">
            {items.map((it, iIdx) => (
              <li key={iIdx}>{it.replace(/^- /, '')}</li>
            ))}
          </ul>
        );
      }

      // Standard paragraph with highlight detection
      // Find which highlights match in this paragraph
      let renderedParts: React.ReactNode[] = [para];

      activeHls.forEach((hl) => {
        const nextParts: React.ReactNode[] = [];
        renderedParts.forEach((part) => {
          if (typeof part !== 'string') {
            nextParts.push(part);
            return;
          }

          const index = part.indexOf(hl.text);
          if (index === -1) {
            nextParts.push(part);
            return;
          }

          const before = part.slice(0, index);
          const match = part.slice(index, index + hl.text.length);
          const after = part.slice(index + hl.text.length);

          if (before) nextParts.push(before);

          const catMeta = HIGHLIGHT_CATEGORIES[hl.category];
          nextParts.push(
            <mark
              key={`hl-${hl.id}-${index}`}
              id={`highlight-${hl.id}`}
              className={`highlight-${hl.category} cursor-pointer group relative inline font-medium transition-all`}
              onClick={() => setExplainingConcept(hl.text)}
              title={`${catMeta.label}: ${hl.noteText || 'Click to explain'}`}
            >
              {match}
              {hl.noteText && (
                <span className="hidden group-hover:inline-block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 text-[10px] bg-slate-900 text-white rounded shadow-md whitespace-nowrap z-30">
                  {hl.noteText}
                </span>
              )}
            </mark>
          );

          if (after) nextParts.push(after);
        });
        renderedParts = nextParts;
      });

      // Highlight Search query if present
      if (searchQuery.trim().length > 1) {
        const searchParts: React.ReactNode[] = [];
        const q = searchQuery.toLowerCase();
        renderedParts.forEach((part, partIdx) => {
          if (typeof part !== 'string') {
            searchParts.push(part);
            return;
          }
          const lower = part.toLowerCase();
          const matchIdx = lower.indexOf(q);
          if (matchIdx !== -1) {
            searchParts.push(part.slice(0, matchIdx));
            searchParts.push(
              <span key={`search-${partIdx}`} className="bg-amber-300 dark:bg-amber-600 font-bold px-0.5 rounded text-slate-900 dark:text-white">
                {part.slice(matchIdx, matchIdx + q.length)}
              </span>
            );
            searchParts.push(part.slice(matchIdx + q.length));
          } else {
            searchParts.push(part);
          }
        });
        renderedParts = searchParts;
      }

      return (
        <p
          key={pIdx}
          className={`leading-relaxed my-3 transition-opacity ${
            focusMode ? 'opacity-85 hover:opacity-100' : 'text-slate-800 dark:text-slate-200'
          }`}
        >
          {renderedParts}
        </p>
      );
    });
  };

  const activeHighlights = activeDocument?.highlights || [];
  const filteredHighlights = categoryFilter === 'all'
    ? activeHighlights
    : activeHighlights.filter(h => h.category === categoryFilter);

  const scrollToHighlight = (id: string) => {
    const el = document.getElementById(`highlight-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-amber-500');
      setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Chapter Selection Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 text-left font-medium text-xs text-slate-800 dark:text-slate-200"
            >
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="truncate max-w-[240px] sm:max-w-xs">
                <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-normal uppercase tracking-wider">
                  {activeDocument?.subject || 'Subject'}
                </span>
                <span className="font-bold text-xs truncate block">
                  {activeDocument?.title || 'Select Chapter'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 ml-1" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-1 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {isHinglish ? 'Syllabus & Chapters' : 'Select Study Chapter'}
                </div>
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDocId(doc.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      doc.id === activeDocId
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-medium truncate block">{doc.title}</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">
                        {doc.subject} · {doc.highlights.length} highlights
                      </span>
                    </div>
                  </button>
                ))}
                <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenNewChapter();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isHinglish ? '+ Naya Chapter / Text Dalein' : '+ Add Chapter or Syllabus'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>{activeDocument?.readTime}</span>
            <span>·</span>
            <span>{activeDocument?.highlights.length || 0} {isHinglish ? 'aham concepts highlighted' : 'concepts highlighted'}</span>
          </div>
        </div>

        {/* Reader Controls Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search in chapter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHinglish ? 'Search in text...' : 'Find keyword...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-600 w-36 focus:w-48 transition-all focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              focusMode
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900'
            }`}
            title="Focus mode dims non-highlighted text to emphasize exam concepts"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isHinglish ? 'Exam Focus' : 'Focus'}</span>
          </button>

          {/* Font Size Selector */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${fontSize === 'sm' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : 'text-slate-600'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${fontSize === 'base' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : 'text-slate-600'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${fontSize === 'lg' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : 'text-slate-600'}`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Reader Stage (Left) + Concepts/Notes Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left Column: Reading & Text Highlighting Area */}
        <main className={`${splitView ? 'lg:col-span-7' : 'lg:col-span-8'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden`}>
          {/* Chapter Cover Hero Image (if available) */}
          {activeDocument?.coverImage && (
            <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden border-b border-slate-200 dark:border-slate-800">
              <img
                src={activeDocument.coverImage}
                alt={activeDocument.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  {activeDocument.subject}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {activeDocument.title}
                </h1>
              </div>
            </div>
          )}

          {/* Interactive Instruction Banner */}
          <div className="px-6 py-3 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Highlighter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {isHinglish
                  ? 'Kisi bhi text ko select karein highlight karne, notes mein bhejne, ya asaan alfaaz mein samajhne ke liye.'
                  : 'Select any text to highlight, add notes, or explain simply with AI.'}
              </span>
            </div>
            <span className="hidden sm:inline font-mono text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              {activeHighlights.length} Saved
            </span>
          </div>

          {/* Reader Content Body */}
          <div
            ref={contentRef}
            onMouseUp={handleMouseUp}
            className={`p-6 sm:p-8 select-text ${
              fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            } leading-relaxed`}
          >
            {renderFormattedContent()}
          </div>
        </main>

        {/* Right Column: Concepts & Highlights Deck OR Side Cornell Notes */}
        <aside className={`${splitView ? 'lg:col-span-5' : 'lg:col-span-4'} space-y-4`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs sticky top-20">
            {/* Header with Tab switcher: Concepts/Highlights vs Side Cornell Notes */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => setSplitTab('highlights')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    splitTab === 'highlights'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {isHinglish ? `Highlights (${filteredHighlights.length})` : `Highlights (${filteredHighlights.length})`}
                </button>
                <button
                  onClick={() => setSplitTab('notes')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    splitTab === 'notes'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isHinglish ? 'Side Notes' : 'Dual Notes'}</span>
                </button>
              </div>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold tabular-nums">
                {splitTab === 'highlights' ? `${filteredHighlights.length} Saved` : `${(notes.find(n => n.documentId === activeDocument?.id) || activeNote)?.cues.length || 0} Cues`}
              </span>
            </div>

            {/* Content for Tab 1: Extracted Highlights */}
            {splitTab === 'highlights' && (
              <>
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap py-3 border-b border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      categoryFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    All ({activeHighlights.length})
                  </button>
                  {(Object.keys(HIGHLIGHT_CATEGORIES) as HighlightCategory[]).map((catKey) => {
                    const meta = HIGHLIGHT_CATEGORIES[catKey];
                    const count = activeHighlights.filter(h => h.category === catKey).length;
                    if (count === 0 && categoryFilter !== catKey) return null;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setCategoryFilter(catKey)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors flex items-center gap-1 ${
                          categoryFilter === catKey
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100 ring-1 ring-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: meta.dotColor }}
                        />
                        <span>{meta.label}</span>
                        <span className="text-[10px] opacity-75 tabular-nums">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Highlighted items list */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[58vh] overflow-y-auto mt-2 pr-1">
                  {filteredHighlights.length === 0 ? (
                    <div className="py-8 text-center text-slate-600 dark:text-slate-400">
                      <Highlighter className="w-7 h-7 mx-auto mb-2 opacity-40 text-amber-500" />
                      <p className="text-xs font-medium">
                        {isHinglish ? 'Abhi koi highlight nahi ki gayi.' : 'No highlights saved yet.'}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        {isHinglish ? 'Text select karein highlight aur notes banane ke liye.' : 'Select text in the left pane to extract concepts.'}
                      </p>
                    </div>
                  ) : (
                    filteredHighlights.map((hl) => {
                      const meta = HIGHLIGHT_CATEGORIES[hl.category];
                      return (
                        <div key={hl.id} className="py-3 group space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: meta.dotColor }}
                              />
                              <span>{meta.label}</span>
                            </span>
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => scrollToHighlight(hl.id)}
                                className="p-1 rounded text-slate-600 hover:text-slate-700 dark:hover:text-slate-300"
                                title="Scroll to in text"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setExplainingConcept(hl.text)}
                                className="p-1 rounded text-amber-600 hover:text-amber-700"
                                title="Explain simply with AI"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => insertHighlightIntoNote(hl)}
                                className="p-1 rounded text-sky-600 hover:text-sky-700"
                                title="Send to Cornell Notes"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeHighlight(activeDocument!.id, hl.id)}
                                className="p-1 rounded text-rose-500 hover:text-rose-700"
                                title="Delete Highlight"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p
                            onClick={() => scrollToHighlight(hl.id)}
                            className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug cursor-pointer hover:text-amber-600 dark:hover:text-amber-400"
                          >
                            "{hl.text}"
                          </p>

                          {hl.noteText && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded border border-slate-200/50 dark:border-slate-800 italic">
                              Note: {hl.noteText}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* Content for Tab 2: Interactive Side Cornell Notes */}
            {splitTab === 'notes' && (
              <div className="space-y-3 mt-3 max-h-[58vh] overflow-y-auto pr-1">
                {(() => {
                  const currentDocNote = notes.find(n => n.documentId === activeDocument?.id) || activeNote;

                  if (!currentDocNote) {
                    return (
                      <div className="py-6 text-center text-slate-600 dark:text-slate-400 space-y-3">
                        <FileText className="w-8 h-8 mx-auto opacity-40 text-amber-500" />
                        <p className="text-xs font-semibold">
                          {isHinglish ? 'Is chapter ke liye Cornell Note banayein' : 'Create Cornell Notes for this Chapter'}
                        </p>
                        <button
                          onClick={() => {
                            if (!activeDocument) return;
                            createNote({
                              documentId: activeDocument.id,
                              title: `${activeDocument.title} - Notes`,
                              subject: activeDocument.subject,
                              cues: ['Key principle & definition', 'Numerical formula & units'],
                              notes: `# ${activeDocument.title}\n\n- Key points from reading:\n`,
                              summary: 'Core concept summary for rapid 24h exam recall.',
                              tags: activeDocument.tags || []
                            });
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                        >
                          + Create Cornell Note
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                            {isHinglish ? 'Exam Recall Cues / Sawal' : 'Recall Cues (Exam Prompts)'}
                          </label>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400">
                            {currentDocNote.cues.length} prompts
                          </span>
                        </div>
                        <div className="space-y-1">
                          {currentDocNote.cues.map((cue, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-1.5 rounded-md bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-medium text-amber-900 dark:text-amber-200 flex items-center justify-between"
                            >
                              <span className="truncate">{cue}</span>
                              <button
                                onClick={() => {
                                  const updated = currentDocNote.cues.filter((_, i) => i !== cIdx);
                                  updateNote(currentDocNote.id, { cues: updated });
                                }}
                                className="text-slate-600 hover:text-rose-500 p-0.5"
                                title="Remove cue"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Side Notes Textarea */}
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                          {isHinglish ? 'Main Notes (Key Concepts)' : 'Cornell Main Notes'}
                        </label>
                        <textarea
                          rows={6}
                          value={currentDocNote.notes}
                          onChange={(e) => updateNote(currentDocNote.id, { notes: e.target.value })}
                          placeholder={isHinglish ? 'Reading ke doran important baatein yahan likhein...' : 'Take notes side-by-side while reading...'}
                          className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed resize-y"
                        />
                      </div>

                      {/* 24-hr Summary */}
                      <div>
                        <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                          {isHinglish ? '24h Revision Summary (Khulasa)' : '24h Revision Summary'}
                        </label>
                        <textarea
                          rows={3}
                          value={currentDocNote.summary}
                          onChange={(e) => updateNote(currentDocNote.id, { summary: e.target.value })}
                          placeholder={isHinglish ? 'Akhir mein 2-3 lines mein khulasa likhein...' : 'Synthesize 2-3 lines summary for rapid exam recall...'}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Quick Actions at bottom of drawer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveTab('notes')}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isHinglish ? 'Cornell Workspace' : 'Full Workspace'}</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isHinglish ? 'Mock Test' : 'Mock Test'}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Selection Toolbar */}
      {toolbarPosition && selectedText && (
        <HighlightToolbar
          position={toolbarPosition}
          selectedText={selectedText}
          onApplyHighlight={handleApplyHighlight}
          onExplainConcept={(txt) => setExplainingConcept(txt)}
          onSendToNote={handleSendToNote}
          onMakeFlashcard={handleMakeFlashcard}
          onSaveAsQuestion={handleSaveAsQuestion}
          onSaveToVault={handleSaveToVault}
          onClose={clearSelection}
          isHinglish={isHinglish}
        />
      )}

      {/* Concept Explainer Modal */}
      {explainingConcept && (
        <ConceptExplainerModal
          concept={explainingConcept}
          contextText={activeDocument?.content.slice(0, 1000)}
          onClose={() => setExplainingConcept(null)}
        />
      )}
    </div>
  );
};

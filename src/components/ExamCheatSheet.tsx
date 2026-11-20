import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { HIGHLIGHT_CATEGORIES, HighlightCategory } from '../types/study';
import {
  Zap,
  Printer,
  Copy,
  CheckCircle2,
  Filter,
  BookOpen
} from 'lucide-react';

export const ExamCheatSheet: React.FC = () => {
  const { documents, language } = useStudy();
  const isHinglish = language === 'hinglish';

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<HighlightCategory | 'all'>('all');
  const [copied, setCopied] = useState(false);

  // Collect unique subjects
  const subjects = Array.from(new Set(documents.map(d => d.subject)));

  // Aggregate highlights across documents
  const filteredDocs = selectedSubject === 'all'
    ? documents
    : documents.filter(d => d.subject === selectedSubject);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    let text = `# Rapid Exam Revision Sheet (Medha Study Studio)\n\n`;
    filteredDocs.forEach((doc) => {
      text += `## ${doc.subject}: ${doc.title}\n`;
      const hls = selectedCategory === 'all'
        ? doc.highlights
        : doc.highlights.filter(h => h.category === selectedCategory);

      hls.forEach((h) => {
        text += `- [${h.category.toUpperCase()}] ${h.text}${h.noteText ? ` (${h.noteText})` : ''}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {isHinglish ? '1-Page Rapid Exam Cheat Sheet' : '1-Page Exam Cheat Sheet'}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {isHinglish
              ? 'Tamam chapters ke formulas, laws, aur high-yield exam points ek sath.'
              : 'Collated repository of formulas, definitions, and high-probability points.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Subject Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none pr-2 py-0.5"
            >
              <option value="all">{isHinglish ? 'Tamam Mazameen (All)' : 'All Subjects'}</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
            title="Copy all to clipboard"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Sheet'}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-xs"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isHinglish ? 'Print Karein / PDF' : 'Print Sheet'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills (no-print) */}
      <div className="flex items-center gap-2 py-4 no-print flex-wrap">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Filter By:</span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Concepts
        </button>
        {(['formula', 'exam', 'core', 'quick_fact'] as HighlightCategory[]).map(cat => {
          const meta = HIGHLIGHT_CATEGORIES[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100 ring-1 ring-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.dotColor }} />
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Printable Cheat Sheet Grid */}
      <div className="space-y-6 mt-2 print:space-y-4">
        {filteredDocs.map((doc) => {
          const docHighlights = selectedCategory === 'all'
            ? doc.highlights
            : doc.highlights.filter(h => h.category === selectedCategory);

          if (docHighlights.length === 0) return null;

          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs print:border-slate-400 print:shadow-none print:p-4 print:rounded-none"
            >
              {/* Document Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    {doc.subject}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {doc.title}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
                  {docHighlights.length} points
                </span>
              </div>

              {/* High-yield highlights list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2 print:gap-2">
                {docHighlights.map((hl) => {
                  const meta = HIGHLIGHT_CATEGORIES[hl.category];
                  return (
                    <div
                      key={hl.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex flex-col justify-between print:bg-white print:border-slate-300 print:p-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: meta.dotColor }}
                            />
                            <span>{meta.label}</span>
                          </span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug pt-0.5">
                          "{hl.text}"
                        </p>
                      </div>

                      {hl.noteText && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] text-amber-800 dark:text-amber-300 italic font-mono">
                          ★ {hl.noteText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

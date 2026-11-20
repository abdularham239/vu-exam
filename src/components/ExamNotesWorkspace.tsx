import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Download,
  ListPlus,
  Heading,
  Bold,
  Italic,
  Code,
  CheckCircle2,
  Copy
} from 'lucide-react';

export const ExamNotesWorkspace: React.FC = () => {
  const {
    notes,
    activeNoteId,
    activeNote,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    documents,
    activeDocument,
    language
  } = useStudy();

  const isHinglish = language === 'hinglish';

  const [newCue, setNewCue] = useState('');
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Fallback if no active note exists
  const currentNote = activeNote || notes[0];

  const handleAddCue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote || !newCue.trim()) return;
    updateNote(currentNote.id, {
      cues: [...(currentNote.cues || []), newCue.trim()]
    });
    setNewCue('');
  };

  const handleRemoveCue = (index: number) => {
    if (!currentNote) return;
    const updated = [...currentNote.cues];
    updated.splice(index, 1);
    updateNote(currentNote.id, { cues: updated });
  };

  const handleInsertAllHighlights = () => {
    if (!currentNote || !activeDocument) return;
    const highlights = activeDocument.highlights || [];
    if (highlights.length === 0) return;

    let textToAppend = `\n\n### ${isHinglish ? 'Highlights Se Points' : 'Extracted Chapter Highlights'}\n`;
    highlights.forEach((h) => {
      textToAppend += `- **[${h.category.toUpperCase()}]**: ${h.text}${h.noteText ? ` *(Note: ${h.noteText})*` : ''}\n`;
    });

    updateNote(currentNote.id, {
      notes: currentNote.notes + textToAppend
    });
  };

  const handleAiSummarize = async () => {
    if (!currentNote) return;
    setIsAiSummarizing(true);
    try {
      const parentDoc = documents.find(d => d.id === currentNote.documentId) || activeDocument;
      const res = await fetch('/api/ai/summarize-cornell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: currentNote.title,
          content: parentDoc?.content || currentNote.notes,
          highlights: parentDoc?.highlights?.map(h => h.text) || []
        })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      updateNote(currentNote.id, {
        cues: data.cues && data.cues.length > 0 ? data.cues : currentNote.cues,
        notes: data.notes || currentNote.notes,
        summary: data.summary || currentNote.summary
      });
    } catch (err) {
      console.error('AI Summarization failed:', err);
    } finally {
      setIsAiSummarizing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!currentNote) return;
    const fullMarkdown = `# ${currentNote.title} (${currentNote.subject})

## Cornell Cue Questions:
${currentNote.cues.map(c => `- ${c}`).join('\n')}

## Notes:
${currentNote.notes}

## 24-Hour Exam Summary:
${currentNote.summary}
`;
    navigator.clipboard.writeText(fullMarkdown);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    if (!currentNote) return;
    const textarea = document.getElementById('cornell-notes-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    updateNote(currentNote.id, { notes: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Bar for Notes Workspace */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Note Switcher Chips */}
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                note.id === currentNote?.id
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate max-w-[140px]">{note.title}</span>
            </button>
          ))}

          <button
            onClick={() => createNote(activeDocument?.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHinglish ? 'Naya Note' : 'New Note'}</span>
          </button>
        </div>

        {/* Global Note Actions */}
        <div className="flex items-center gap-2">
          {/* AI Cornell Synthesis */}
          <button
            onClick={handleAiSummarize}
            disabled={isAiSummarizing || !currentNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors disabled:opacity-50"
            title="Auto-organize notes into Cornell format using AI"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiSummarizing ? 'animate-spin' : 'text-amber-600'}`} />
            <span>{isAiSummarizing ? (isHinglish ? 'Tayar ho raha hai...' : 'Structuring...') : (isHinglish ? 'AI Cornell Format' : 'AI Cornell Synthesis')}</span>
          </button>

          {/* Import highlights button */}
          <button
            onClick={handleInsertAllHighlights}
            disabled={!currentNote || !activeDocument || activeDocument.highlights.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Insert all highlights from active reading chapter into this note"
          >
            <ListPlus className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">{isHinglish ? 'Highlights Shamil Karein' : 'Pull Highlights'}</span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Copy as Markdown"
          >
            {copyFeedback ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Print / Export */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Delete Note */}
          {notes.length > 1 && (
            <button
              onClick={() => currentNote && deleteNote(currentNote.id)}
              className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {currentNote ? (
        <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Note Title & Header Metadata */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
                className="text-lg sm:text-xl font-bold bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 -ml-1 w-full"
                placeholder="Note Title"
              />
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 shrink-0">
                <input
                  type="text"
                  value={currentNote.subject}
                  onChange={(e) => updateNote(currentNote.id, { subject: e.target.value })}
                  className="bg-transparent border-b border-dotted border-slate-400 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none px-1 w-24 sm:w-28 text-right"
                  placeholder="Subject"
                />
                <span>·</span>
                <span className="font-mono">{currentNote.updatedAt}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
              {isHinglish
                ? 'Cornell System: Bayan (Left) par Sawalaat aur Cue Words, Dayen (Right) par Mukammal Notes, aur Neeche (Bottom) par 24-Ghante ka Exam Summary.'
                : 'Cornell Note Method: Left column for exam cues/questions, Right pane for detailed study notes, and Bottom row for 24h rapid exam summary.'}
            </div>
          </div>

          {/* Cornell Grid Structure: 30% Cues + 70% Notes */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            {/* Left 30%: Cornell Cue Column (Exam Questions & Keywords) */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-5 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {isHinglish ? '1. Cues & Exam Sawalaat' : '1. Cues & Exam Questions'}
                  </h3>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                    {isHinglish ? 'Active Recall' : 'Prompt Col'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {isHinglish
                    ? 'Yahan wo sawalaat likhein jinka jawab notes dekhe baghair de sakein:'
                    : 'Questions to test yourself on without looking at notes:'}
                </p>

                {/* Cue questions list */}
                <ul className="space-y-2">
                  {(currentNote.cues || []).map((cue, idx) => (
                    <li
                      key={idx}
                      className="group flex items-start justify-between gap-2 text-xs bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    >
                      <div className="flex items-start gap-1.5 text-slate-800 dark:text-slate-200">
                        <span className="text-amber-600 dark:text-amber-400 font-mono font-bold shrink-0">Q{idx + 1}:</span>
                        <span>{cue}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveCue(idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="Remove question"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add New Cue Form */}
              <form onSubmit={handleAddCue} className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 no-print">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newCue}
                    onChange={(e) => setNewCue(e.target.value)}
                    placeholder={isHinglish ? 'Naya exam sawal likhein...' : 'Add cue question...'}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shrink-0"
                    title="Add cue question"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right 70%: Cornell Main Notes Column */}
            <div className="md:col-span-8 p-5 flex flex-col">
              {/* Markdown Quick Formatting Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3 no-print">
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => insertMarkdownSyntax('### ', '')}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Heading 3"
                  >
                    <Heading className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertMarkdownSyntax('**', '**')}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertMarkdownSyntax('*', '*')}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertMarkdownSyntax('\n- ', '')}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Bullet point"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertMarkdownSyntax('`', '`')}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Code / Equation block"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  {currentNote.notes.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {/* Notes Content Textarea */}
              <textarea
                id="cornell-notes-textarea"
                value={currentNote.notes}
                onChange={(e) => updateNote(currentNote.id, { notes: e.target.value })}
                placeholder={isHinglish ? 'Yahan apne tafseeli notes, formulas, aur derivations likhein...' : 'Write detailed study notes, formulas, step-by-step logic...'}
                className="w-full flex-1 p-3 text-sm leading-relaxed rounded-xl border-none bg-transparent text-slate-800 dark:text-slate-200 resize-none focus:outline-none font-sans"
                rows={14}
              />
            </div>
          </div>

          {/* Cornell Bottom Row: 24-Hour Exam Rapid Revision Summary */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-5 bg-amber-50/30 dark:bg-amber-950/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>{isHinglish ? '3. 24-Ghante Ki Exam Summary (Rapid Recap)' : '3. 24-Hour Rapid Exam Revision Summary'}</span>
              </h3>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">
                {isHinglish ? 'Exam hall mein jane se pehle aakhri review' : 'Final pre-exam review takeaway'}
              </span>
            </div>
            <textarea
              value={currentNote.summary}
              onChange={(e) => updateNote(currentNote.id, { summary: e.target.value })}
              placeholder={isHinglish ? 'Ahem formulas aur khulasa yahan likhein...' : 'Write concise 3-4 sentence rapid review synthesis...'}
              rows={3}
              className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-600 dark:text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-500" />
          <p className="text-sm font-semibold">{isHinglish ? 'Koi Note nahi mila.' : 'No notes available.'}</p>
          <button
            onClick={() => createNote(activeDocument?.id)}
            className="mt-3 px-4 py-2 text-xs font-semibold bg-amber-500 text-white rounded-lg shadow-sm"
          >
            {isHinglish ? '+ Pehla Note Banayein' : '+ Create First Note'}
          </button>
        </div>
      )}
    </div>
  );
};

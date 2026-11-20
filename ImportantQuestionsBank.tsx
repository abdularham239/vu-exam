import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { ImportantQuestion } from '../types/study';
import {
  HelpCircle,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Layers,
  BookOpen
} from 'lucide-react';

export const ImportantQuestionsBank: React.FC = () => {
  const {
    importantQuestions,
    addImportantQuestion,
    updateImportantQuestion,
    deleteImportantQuestion,
    markQuestionStatus,
    addFlashcard,
    documents,
    activeDocument,
    language
  } = useStudy();

  const isHinglish = language === 'hinglish';

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'to_practice' | 'writing_practiced' | 'mastered'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(importantQuestions[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Question Form State
  const [newQuestion, setNewQuestion] = useState('');
  const [newSubject, setNewSubject] = useState(activeDocument?.subject || 'Physics');
  const [newChapter, setNewChapter] = useState(activeDocument?.title || '');
  const [newMarks, setNewMarks] = useState<number>(5);
  const [newType, setNewType] = useState<ImportantQuestion['questionType']>('long');
  const [newImportance, setNewImportance] = useState<ImportantQuestion['importance']>('very_high');
  const [newFrequency, setNewFrequency] = useState('');
  const [newModelAnswer, setNewModelAnswer] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Unique subjects
  const subjects = Array.from(new Set(importantQuestions.map(q => q.subject)));

  // Filtered Questions
  const filteredQuestions = importantQuestions.filter(q => {
    const matchesSubject = subjectFilter === 'all' || q.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.modelAnswer && q.modelAnswer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.chapterTitle && q.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesStatus && matchesSearch;
  });

  const handleAiGenerateAnswer = async () => {
    if (!newQuestion.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/model-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestion,
          subject: newSubject,
          marks: newMarks,
          chapterTitle: newChapter
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data.modelAnswer) {
        setNewModelAnswer(data.modelAnswer);
      }
    } catch (err) {
      console.error('Failed to generate answer:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newModelAnswer.trim()) return;

    addImportantQuestion({
      question: newQuestion.trim(),
      subject: newSubject.trim() || 'General',
      chapterTitle: newChapter.trim(),
      marks: Number(newMarks) || 5,
      questionType: newType,
      importance: newImportance,
      frequency: newFrequency.trim() || undefined,
      modelAnswer: newModelAnswer.trim(),
      status: 'to_practice'
    });

    setNewQuestion('');
    setNewModelAnswer('');
    setNewFrequency('');
    setShowAddModal(false);
  };

  const handleCopyAnswer = (q: ImportantQuestion) => {
    const text = `Q: ${q.question} (${q.marks} Marks)\n\nModel Answer:\n${q.modelAnswer}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConvertToFlashcard = (q: ImportantQuestion) => {
    addFlashcard({
      documentId: q.documentId || 'general',
      front: `Important ${q.marks}-Mark Question: ${q.question}`,
      back: `Model Points:\n${q.modelAnswer.slice(0, 300)}...`,
      category: 'Important Exam Question'
    });
    alert(isHinglish ? 'Flashcard ban gaya aur Active Recall mein shamil ho gaya!' : 'Added to Flashcards deck!');
  };

  // Stats
  const totalQuestions = importantQuestions.length;
  const masteredCount = importantQuestions.filter(q => q.status === 'mastered').length;
  const practicedCount = importantQuestions.filter(q => q.status === 'writing_practiced').length;
  const pendingCount = importantQuestions.filter(q => q.status === 'to_practice').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {isHinglish ? 'Important Exam Questions Bank' : 'Important Questions Bank'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isHinglish
                  ? 'Repeated board sawalaat aur full-marks model answers save karein.'
                  : 'Save high-probability questions, past paper repeats, and full-mark model answers.'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHinglish ? '+ Naya Question Save Karein' : '+ Add Important Question'}</span>
        </button>
      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Total Saved' : 'Total Questions'}
          </span>
          <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">
            {totalQuestions}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Practice Baki Hai' : 'To Practice'}
          </span>
          <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
            {pendingCount}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Likh Kar Check Kiya' : 'Writing Practiced'}
          </span>
          <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {practicedCount}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Mukammal Tayar (Mastered)' : 'Mastered'}
          </span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {masteredCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHinglish ? 'Question ya topic search karein...' : 'Search questions or model answers...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border-none bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
          >
            <option value="all">{isHinglish ? 'Tamam Mazameen' : 'All Subjects'}</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
          >
            <option value="all">{isHinglish ? 'Tamam Status' : 'All Status'}</option>
            <option value="to_practice">{isHinglish ? 'To Practice' : 'To Practice'}</option>
            <option value="writing_practiced">{isHinglish ? 'Writing Practiced' : 'Writing Practiced'}</option>
            <option value="mastered">{isHinglish ? 'Mastered' : 'Mastered'}</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isHinglish ? 'Koi Question Nahi Mila' : 'No Questions Found'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {isHinglish
                ? 'Apne exam syllabus ya past papers ke important sawal yahan save karein.'
                : 'Save important exam questions to organize your targeted revision.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
            >
              {isHinglish ? '+ Pehla Question Save Karein' : '+ Add Question'}
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl transition-all shadow-xs overflow-hidden ${
                  q.importance === 'very_high'
                    ? 'border-rose-200 dark:border-rose-900/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        {q.subject}
                      </span>
                      <span>·</span>
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {q.marks} Marks
                      </span>
                      <span>·</span>
                      <span className="capitalize text-slate-600 dark:text-slate-400 font-medium">
                        {q.questionType} Question
                      </span>

                      {q.frequency && (
                        <>
                          <span>·</span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono text-[10px] bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                            ★ {q.frequency}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg capitalize ${
                        q.status === 'mastered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : q.status === 'writing_practiced'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {q.status.replace('_', ' ')}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Model Answer & Actions */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                    {/* Model Answer Body */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isHinglish ? 'Full-Marks Model Answer & Derivation' : 'Model Answer & Marking Steps'}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyAnswer(q)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1"
                            title="Copy Answer"
                          >
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">{copiedId === q.id ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => handleConvertToFlashcard(q)}
                            className="p-1 rounded text-amber-600 hover:text-amber-700 text-xs flex items-center gap-1"
                            title="Turn into Flashcard"
                          >
                            <Layers className="w-3 h-3" />
                            <span className="text-[10px]">To Flashcard</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap border border-slate-200/60 dark:border-slate-800">
                        {q.modelAnswer}
                      </div>
                    </div>

                    {/* Key points if available */}
                    {q.keyPoints && q.keyPoints.length > 0 && (
                      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs">
                        <strong className="text-amber-800 dark:text-amber-300 block mb-1">
                          {isHinglish ? 'Examiner Ki Nazar (Key Points to Score Full Marks):' : 'Key Marking Points:'}
                        </strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700 dark:text-slate-300">
                          {q.keyPoints.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Status Toggle & Delete */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 text-[11px] font-semibold">{isHinglish ? 'Practice Status:' : 'Status:'}</span>
                        <button
                          onClick={() => markQuestionStatus(q.id, 'to_practice')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            q.status === 'to_practice'
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          To Practice
                        </button>
                        <button
                          onClick={() => markQuestionStatus(q.id, 'writing_practiced')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            q.status === 'writing_practiced'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Written
                        </button>
                        <button
                          onClick={() => markQuestionStatus(q.id, 'mastered')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            q.status === 'mastered'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Mastered
                        </button>
                      </div>

                      <button
                        onClick={() => deleteImportantQuestion(q.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isHinglish ? 'Naya Important Exam Question Save Karein' : 'Save Important Exam Question'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isHinglish ? 'Sawal (Question Statement)' : 'Exam Question'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder={isHinglish ? 'e.g. State Newton’s Second Law and prove F = ma...' : 'e.g. Derive Newton’s Second Law of Motion...'}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHinglish ? 'Mazmoon (Subject)' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Physics, Bio..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHinglish ? 'Marks (Number)' : 'Marks Weight'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newMarks}
                    onChange={(e) => setNewMarks(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="long">Long (5+ Marks)</option>
                    <option value="short">Short (2-3 Marks)</option>
                    <option value="conceptual">Conceptual</option>
                    <option value="numerical">Numerical</option>
                    <option value="viva">Viva / Oral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Importance
                  </label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="very_high">Very High (Must Prepare)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isHinglish ? 'Exam Frequency / Saal (Optional)' : 'Frequency / Exam Year (Optional)'}
                </label>
                <input
                  type="text"
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  placeholder={isHinglish ? 'e.g. Board Exam 2024, 2022 (Repeated 3x)' : 'e.g. Repeated in 2024, 2023'}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {/* Model Answer Section with AI Generate Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isHinglish ? 'Model Answer (Full Marks Solution)' : 'Model Answer'}
                  </label>
                  <button
                    type="button"
                    onClick={handleAiGenerateAnswer}
                    disabled={isAiGenerating || !newQuestion.trim()}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-md border border-amber-300 dark:border-amber-800 hover:bg-amber-100 transition-colors disabled:opacity-40"
                  >
                    <Sparkles className={`w-3 h-3 ${isAiGenerating ? 'animate-spin' : ''}`} />
                    <span>{isAiGenerating ? 'AI Answer Likh Raha Hai...' : 'AI Se Model Answer Banayein'}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={6}
                  value={newModelAnswer}
                  onChange={(e) => setNewModelAnswer(e.target.value)}
                  placeholder={isHinglish ? 'Step-by-step jawab, formulas aur derivation likhein ya upar AI button dabayein...' : 'Write step-by-step model answer or click AI generate above...'}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  {isHinglish ? 'Question Save Karein' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

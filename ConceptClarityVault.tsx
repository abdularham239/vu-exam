import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { ConceptVaultItem } from '../types/study';
import {
  Lightbulb,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search,
  BookOpen,
  Filter,
  Flame,
  ArrowRight
} from 'lucide-react';

export const ConceptClarityVault: React.FC = () => {
  const {
    conceptVault,
    addConceptVaultItem,
    updateConceptVaultItem,
    deleteConceptVaultItem,
    setClarityLevel,
    activeDocument,
    language
  } = useStudy();

  const isHinglish = language === 'hinglish';

  const [searchQuery, setSearchQuery] = useState('');
  const [clarityFilter, setClarityFilter] = useState<'all' | 'confused' | 'getting_there' | 'crystal_clear'>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [personalNotesText, setPersonalNotesText] = useState('');

  // Form State
  const [newConcept, setNewConcept] = useState('');
  const [newSubject, setNewSubject] = useState(activeDocument?.subject || 'Physics');
  const [newChapter, setNewChapter] = useState(activeDocument?.title || '');
  const [newEasyExplanation, setNewEasyExplanation] = useState('');
  const [newAnalogy, setNewAnalogy] = useState('');
  const [newWhyConfusing, setNewWhyConfusing] = useState('');
  const [newRules, setNewRules] = useState('');
  const [newMyNotes, setNewMyNotes] = useState('');
  const [newClarityLevel, setNewClarityLevel] = useState<ConceptVaultItem['clarityLevel']>('confused');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Unique subjects
  const subjects = Array.from(new Set(conceptVault.map(c => c.subject)));

  // Filtered concepts
  const filteredConcepts = conceptVault.filter(item => {
    const matchesClarity = clarityFilter === 'all' || item.clarityLevel === clarityFilter;
    const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.easyExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analogy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whyConfusing.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClarity && matchesSubject && matchesSearch;
  });

  const handleAiDeepClarity = async () => {
    if (!newConcept.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/concept-clarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: newConcept,
          subject: newSubject,
          chapterTitle: newChapter,
          language
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data.easyExplanation) setNewEasyExplanation(data.easyExplanation);
      if (data.analogy) setNewAnalogy(data.analogy);
      if (data.whyConfusing) setNewWhyConfusing(data.whyConfusing);
      if (data.keyRulesOrFormula) setNewRules(data.keyRulesOrFormula);
    } catch (err) {
      console.error('Failed to generate concept clarity:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConcept.trim() || !newEasyExplanation.trim()) return;

    addConceptVaultItem({
      concept: newConcept.trim(),
      subject: newSubject.trim() || 'General',
      chapterTitle: newChapter.trim() || undefined,
      easyExplanation: newEasyExplanation.trim(),
      analogy: newAnalogy.trim(),
      whyConfusing: newWhyConfusing.trim(),
      keyRulesOrFormula: newRules.trim(),
      myOwnNotes: newMyNotes.trim() || undefined,
      clarityLevel: newClarityLevel
    });

    setNewConcept('');
    setNewEasyExplanation('');
    setNewAnalogy('');
    setNewWhyConfusing('');
    setNewRules('');
    setNewMyNotes('');
    setShowAddModal(false);
  };

  const handleSavePersonalNotes = (id: string) => {
    updateConceptVaultItem(id, { myOwnNotes: personalNotesText });
    setEditingNotesId(null);
  };

  // Stats
  const totalConcepts = conceptVault.length;
  const confusedCount = conceptVault.filter(c => c.clarityLevel === 'confused').length;
  const gettingThereCount = conceptVault.filter(c => c.clarityLevel === 'getting_there').length;
  const crystalClearCount = conceptVault.filter(c => c.clarityLevel === 'crystal_clear').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {isHinglish ? 'Concept Clarity Vault' : 'Concept Clarity Vault'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isHinglish
                  ? 'Bina ratta lagaye har mushkil concept ko asaan misalon aur clarity se save karein.'
                  : 'Master difficult concepts with intuitive analogies, misconception alerts, and clarity tracking.'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHinglish ? '+ Naya Concept Save Karein' : '+ Add Concept to Clear'}</span>
        </button>
      </div>

      {/* Clarity Meter Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Kul Concepts' : 'Total Concepts'}
          </span>
          <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">
            {totalConcepts}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? '🔴 Confusion Hai' : 'Needs Clarity'}
          </span>
          <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
            {confusedCount}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? '🟡 Samajh Aa Raha Hai' : 'Getting There'}
          </span>
          <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {gettingThereCount}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? '🟢 Crystal Clear!' : 'Crystal Clear'}
          </span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {crystalClearCount}
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
            placeholder={isHinglish ? 'Concept ya misal search karein...' : 'Search concepts, analogies, or notes...'}
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

          {/* Clarity Filter */}
          <select
            value={clarityFilter}
            onChange={(e) => setClarityFilter(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
          >
            <option value="all">{isHinglish ? 'Tamam Clarity Levels' : 'All Clarity Levels'}</option>
            <option value="confused">{isHinglish ? '🔴 Needs Clarity' : 'Needs Clarity'}</option>
            <option value="getting_there">{isHinglish ? '🟡 Getting There' : 'Getting There'}</option>
            <option value="crystal_clear">{isHinglish ? '🟢 Crystal Clear' : 'Crystal Clear'}</option>
          </select>
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredConcepts.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isHinglish ? 'Koi Concept Saved Nahi Mila' : 'No Concepts Found'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {isHinglish
                ? 'Jo concept confusing lagta ho use yahan save karein taake asani se clear ho sake.'
                : 'Save concepts that require deep intuitive understanding.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
            >
              {isHinglish ? '+ Pehla Concept Save Karein' : '+ Add Concept'}
            </button>
          </div>
        ) : (
          filteredConcepts.map((item) => {
            const isEditing = editingNotesId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-800/60 transition-all"
              >
                <div className="space-y-4">
                  {/* Top Metadata & Clarity Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        {item.subject}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {item.concept}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                          item.clarityLevel === 'crystal_clear'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.clarityLevel === 'getting_there'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.clarityLevel === 'crystal_clear'
                              ? 'bg-emerald-500'
                              : item.clarityLevel === 'getting_there'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span>
                          {item.clarityLevel === 'crystal_clear'
                            ? (isHinglish ? 'Crystal Clear' : 'Crystal Clear')
                            : item.clarityLevel === 'getting_there'
                            ? (isHinglish ? 'Getting There' : 'Getting There')
                            : (isHinglish ? 'Needs Clarity' : 'Needs Clarity')}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Section 1: Asaan Samajh (Explanation) */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-500" />
                      <span>{isHinglish ? 'Asaan Alfaaz Mein Samajh:' : 'Simplified Intuition:'}</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      {item.easyExplanation}
                    </p>
                  </div>

                  {/* Section 2: Real-Life Analogy (Misal) */}
                  {item.analogy && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>{isHinglish ? 'Zindagi Ki Misal (Everyday Analogy):' : 'Relatable Analogy:'}</span>
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 italic">
                        "{item.analogy}"
                      </p>
                    </div>
                  )}

                  {/* Section 3: Where students get confused */}
                  {item.whyConfusing && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isHinglish ? 'Kahan Galti Hoti Hai? (Common Confusion):' : 'Common Misconceptions:'}</span>
                      </span>
                      <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/40">
                        {item.whyConfusing}
                      </p>
                    </div>
                  )}

                  {/* Section 4: Key Rule / Formula */}
                  {item.keyRulesOrFormula && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider font-mono">
                        {isHinglish ? 'Qanoon / Formula:' : 'Core Rule / Formula:'}
                      </span>
                      <div className="text-xs font-mono bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 p-2.5 rounded-lg">
                        {item.keyRulesOrFormula}
                      </div>
                    </div>
                  )}

                  {/* Section 5: Student's Own Personal Notes */}
                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        {isHinglish ? 'Meri Apni Samajh (Personal Note):' : 'My Personal Notes:'}
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingNotesId(item.id);
                            setPersonalNotesText(item.myOwnNotes || '');
                          }}
                          className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          {item.myOwnNotes ? (isHinglish ? 'Edit Karein' : 'Edit') : (isHinglish ? '+ Note Likhein' : '+ Add Note')}
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={personalNotesText}
                          onChange={(e) => setPersonalNotesText(e.target.value)}
                          placeholder={isHinglish ? 'Apni zubaan mein likhein ke aapne kya samjha...' : 'Write in your own words what clicked...'}
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSavePersonalNotes(item.id)}
                            className="px-3 py-1 text-[11px] font-semibold bg-amber-500 text-white rounded-md shadow-2xs"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : item.myOwnNotes ? (
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/30 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800">
                        "{item.myOwnNotes}"
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Bottom Clarity Level Interactive Buttons & Delete */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">{isHinglish ? 'Samajh:' : 'Clarity:'}</span>
                    <button
                      onClick={() => setClarityLevel(item.id, 'confused')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        item.clarityLevel === 'confused'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Confused
                    </button>
                    <button
                      onClick={() => setClarityLevel(item.id, 'getting_there')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        item.clarityLevel === 'getting_there'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Getting it
                    </button>
                    <button
                      onClick={() => setClarityLevel(item.id, 'crystal_clear')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        item.clarityLevel === 'crystal_clear'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Clear!
                    </button>
                  </div>

                  <button
                    onClick={() => deleteConceptVaultItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Concept"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Concept Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isHinglish ? 'Concept Clear Karne Ke Liye Save Karein' : 'Save Concept for Clarity'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHinglish ? 'Concept / Topic Ka Naam' : 'Concept Name'}
                  </label>
                  <input
                    required
                    type="text"
                    value={newConcept}
                    onChange={(e) => setNewConcept(e.target.value)}
                    placeholder={isHinglish ? 'e.g. Centripetal vs Centrifugal Force' : 'e.g. Action-Reaction Pairs'}
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHinglish ? 'Mazmoon (Subject)' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Physics, Bio..."
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* AI Auto-generate Clarity helper button */}
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50">
                <span className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                  {isHinglish ? 'AI se asaan misal aur common confusions khud banwayein:' : 'Auto-synthesize intuitive analogy & traps with AI:'}
                </span>
                <button
                  type="button"
                  onClick={handleAiDeepClarity}
                  disabled={isAiGenerating || !newConcept.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-40 shadow-xs shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                  <span>{isAiGenerating ? 'Clarity Ban Rahi Hai...' : 'AI Clarity Generate'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isHinglish ? 'Asaan Alfaaz Mein Samajh (Simplified Explanation)' : 'Simplified Explanation'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={newEasyExplanation}
                  onChange={(e) => setNewEasyExplanation(e.target.value)}
                  placeholder={isHinglish ? 'Isko aam zubaan mein samjhein...' : 'Explain in simple everyday words...'}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isHinglish ? 'Zindagi Ki Misal (Everyday Analogy)' : 'Real-Life Analogy'}
                </label>
                <textarea
                  rows={2}
                  value={newAnalogy}
                  onChange={(e) => setNewAnalogy(e.target.value)}
                  placeholder={isHinglish ? 'e.g. Jaise gaadi mein break lagane se...' : 'e.g. Think of it like...'}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                  {isHinglish ? 'Kahan Galti Hoti Hai? (Where Students Get Confused)' : 'Common Misconceptions'}
                </label>
                <textarea
                  rows={2}
                  value={newWhyConfusing}
                  onChange={(e) => setNewWhyConfusing(e.target.value)}
                  placeholder={isHinglish ? 'Examiner kahan trap lagata hai ya students kya ghalat samajh lete hain...' : 'Where students get confused in exams...'}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHinglish ? 'Formula / Qanoon (Optional)' : 'Formula / Law (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newRules}
                    onChange={(e) => setNewRules(e.target.value)}
                    placeholder="e.g. F = ma, v = sqrt(GM/r)"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isHinglish ? 'Aapki Samajh Ka Level' : 'Initial Clarity Level'}
                  </label>
                  <select
                    value={newClarityLevel}
                    onChange={(e) => setNewClarityLevel(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="confused">🔴 Confused (Needs Clarity)</option>
                    <option value="getting_there">🟡 Getting There (Samajh aa raha hai)</option>
                    <option value="crystal_clear">🟢 Crystal Clear (Pani ki tarah saaf!)</option>
                  </select>
                </div>
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
                  className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shadow-xs"
                >
                  {isHinglish ? 'Vault Mein Save Karein' : 'Save to Clarity Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

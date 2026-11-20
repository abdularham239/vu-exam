import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Flashcard } from '../types/study';
import {
  RotateCw,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const FlashcardStudySession: React.FC = () => {
  const {
    flashcards,
    addFlashcard,
    deleteFlashcard,
    reviewFlashcard,
    activeDocument,
    language
  } = useStudy();

  const isHinglish = language === 'hinglish';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Card Form state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('Key Concept');

  // Filtered Cards
  const filteredCards = selectedCategory === 'all'
    ? flashcards
    : flashcards.filter(c => c.category === selectedCategory);

  const activeCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: 'again' | 'good' | 'easy') => {
    if (!activeCard) return;
    reviewFlashcard(activeCard.id, rating);
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop back or completed
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  };

  const handleAiGenerateCards = async () => {
    if (!activeDocument) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: activeDocument.title,
          content: activeDocument.content,
          highlights: activeDocument.highlights.map(h => h.text)
        })
      });

      if (!res.ok) throw new Error('Failed to generate cards');
      const data = await res.json();
      if (data.flashcards && Array.isArray(data.flashcards)) {
        data.flashcards.forEach((card: { front: string; back: string; category: string }) => {
          addFlashcard({
            documentId: activeDocument.id,
            front: card.front,
            back: card.back,
            category: card.category || 'AI Generated'
          });
        });
      }
    } catch (err) {
      console.error('Error generating cards:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;
    addFlashcard({
      documentId: activeDocument?.id || 'general',
      front: newFront.trim(),
      back: newBack.trim(),
      category: newCategory.trim() || 'General'
    });
    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
  };

  // Stats
  const masteredCount = flashcards.filter(c => c.status === 'mastered').length;
  const learningCount = flashcards.filter(c => c.status === 'learning').length;
  const newCount = flashcards.filter(c => c.status === 'new').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {isHinglish ? 'Active Recall Flashcards' : 'Active Recall Flashcards'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {isHinglish
              ? 'Spaced Repetition ke zariye formulas aur tareefein paki karein.'
              : 'Test memory recall using spaced repetition intervals.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Generator Button */}
          <button
            onClick={handleAiGenerateCards}
            disabled={isAiGenerating || !activeDocument}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors disabled:opacity-50 shadow-xs"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : 'text-amber-600'}`} />
            <span>{isAiGenerating ? (isHinglish ? 'Cards ban rahe hain...' : 'Generating...') : (isHinglish ? 'AI Se Cards Banayein' : 'Generate with AI')}</span>
          </button>

          {/* Add Manual Card Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHinglish ? 'Naya Card' : 'Add Card'}</span>
          </button>
        </div>
      </div>

      {/* Spaced Repetition Stats Strip */}
      <div className="grid grid-cols-3 gap-3 my-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Naye Sawal' : 'New Cards'}
          </span>
          <span className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
            {newCount}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Practice Mein' : 'In Review'}
          </span>
          <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {learningCount}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
            {isHinglish ? 'Pakke Yaad (Mastered)' : 'Mastered'}
          </span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {masteredCount}
          </span>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="space-y-6">
          {/* Card Counter & Shuffle Bar */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                {currentIndex + 1} / {filteredCards.length}
              </span>
              <span>·</span>
              <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                {activeCard.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px]"
                title="Shuffle Deck"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
              <button
                onClick={() => deleteFlashcard(activeCard.id)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 transition-colors"
                title="Delete this card"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={handleFlip}
            className="group relative cursor-pointer min-h-[300px] sm:min-h-[340px] w-full rounded-2xl p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-lg flex flex-col justify-between transition-all select-none"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isFlipped
                  ? (isHinglish ? 'Jawab / Solution' : 'Back / Solution')
                  : (isHinglish ? 'Sawal / Question' : 'Front / Question')}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                <span>{isHinglish ? 'Click karke dekhein' : 'Click to flip'}</span>
              </span>
            </div>

            {/* Main Question / Answer text */}
            <div className="my-auto text-center py-6">
              <p
                className={`font-semibold leading-relaxed transition-all ${
                  isFlipped
                    ? 'text-base sm:text-lg text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap'
                    : 'text-lg sm:text-xl text-slate-900 dark:text-slate-100'
                }`}
              >
                {isFlipped ? activeCard.back : activeCard.front}
              </p>
            </div>

            {/* Bottom Status metadata */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="capitalize">
                Status: <strong className="font-semibold text-slate-700 dark:text-slate-300">{activeCard.status}</strong>
              </span>
              <span className="tabular-nums">Reviewed: {activeCard.reviewCount} times</span>
            </div>
          </div>

          {/* Rating Response Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleRate('again')}
              className="flex-1 max-w-[140px] py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors text-center"
            >
              {isHinglish ? '❌ Bhool Gaya (Again)' : '❌ Needs Work'}
            </button>
            <button
              onClick={() => handleRate('good')}
              className="flex-1 max-w-[140px] py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors text-center"
            >
              {isHinglish ? '⚠️ Kuch Yaad Hai (Good)' : '⚠️ Good'}
            </button>
            <button
              onClick={() => handleRate('easy')}
              className="flex-1 max-w-[140px] py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors text-center"
            >
              {isHinglish ? '✅ Pakka Yaad Hai (Mastered)' : '✅ Mastered'}
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isHinglish ? 'Pichla' : 'Previous'}</span>
            </button>

            <button
              onClick={handleFlip}
              className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {isFlipped ? (isHinglish ? 'Sawal Par Wapis' : 'Show Question') : (isHinglish ? 'Jawab Dekhein' : 'Show Answer')}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <span>{isHinglish ? 'Agla' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isHinglish ? 'Koi Flashcard Maujood Nahi' : 'No flashcards in this deck'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {isHinglish
              ? 'AI se auto cards banayein ya upar wale button se naya card shamil karein.'
              : 'Generate flashcards automatically from your study notes or create manual ones.'}
          </p>
          <button
            onClick={handleAiGenerateCards}
            disabled={isAiGenerating}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHinglish ? 'AI Se Flashcards Banayein' : 'Generate Cards with AI'}</span>
          </button>
        </div>
      )}

      {/* Manual Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isHinglish ? 'Naya Flashcard Banayein' : 'Create New Flashcard'}
            </h3>
            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isHinglish ? 'Front (Sawal / Term)' : 'Front (Question / Prompt)'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder={isHinglish ? 'e.g. Newton ka 2nd law kya hai?' : 'e.g. Define the Fluid Mosaic Model'}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isHinglish ? 'Back (Jawab / Formula)' : 'Back (Answer / Explanation)'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder={isHinglish ? 'e.g. F = m * a. Force acceleration ke directly proportional hai.' : 'e.g. Phospholipid bilayer with embedded proteins...'}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Formula, Law, Definition"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-xs"
                >
                  {isHinglish ? 'Save Karein' : 'Save Flashcard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

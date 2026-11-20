import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { ConceptExplanation } from '../types/study';
import {
  Sparkles,
  X,
  Plus,
  FileText,
  Check,
  AlertCircle,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

interface ConceptExplainerModalProps {
  concept: string;
  contextText?: string;
  onClose: () => void;
}

export const ConceptExplainerModal: React.FC<ConceptExplainerModalProps> = ({
  concept,
  contextText,
  onClose
}) => {
  const {
    language,
    addFlashcard,
    insertHighlightIntoNote,
    addConceptVaultItem,
    addImportantQuestion,
    activeDocument
  } = useStudy();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConceptExplanation | null>(null);
  const [flashcardSaved, setFlashcardSaved] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [vaultSaved, setVaultSaved] = useState(false);
  const [questionSaved, setQuestionSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isHinglish = language === 'hinglish';

  useEffect(() => {
    let isMounted = true;
    const fetchExplanation = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            concept,
            context: contextText || '',
            language
          })
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const result = await res.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        console.error('Explanation request failed:', err);
        if (isMounted) {
          setData({
            concept,
            definition: isHinglish
              ? `${concept} ek ahem bunyadi concept hai jiska matlab aur rules exam mein direct numerical ya theoretical form mein pooche jate hain.`
              : `${concept} is a key exam principle governing state transformations and fundamental system behaviors.`,
            analogy: isHinglish
              ? `Isko asani se samjhein: jaise kisi cheez par jab tak direct force ya rule na lage, tab tak wo apni purani haalat mein rehti hai.`
              : `Consider it like a baseline state where deviations require explicit external inputs.`,
            examTips: [
              isHinglish ? `Exam mein hamesha iski exact definition aur units zaroor likhein.` : `Always state the formal definition and standard SI units.`,
              isHinglish ? `Examiner aksar trick questions mein boundary conditions check karta hai.` : `Pay attention to edge cases and boundary assumptions.`,
              isHinglish ? `Agar formula hai to pehle formula likh kar components define karein.` : `Derive using standard step-by-step notation to guarantee step marks.`
            ],
            mnemonic: isHinglish
              ? `Formula + Example + Unit = Full Marks!`
              : `Concept -> Formula -> Unit -> Application`
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (concept) {
      fetchExplanation();
    }

    return () => {
      isMounted = false;
    };
  }, [concept, contextText, language, isHinglish]);

  const handleCreateFlashcard = () => {
    if (!data || flashcardSaved) return;
    addFlashcard({
      documentId: activeDocument?.id || 'doc-physics-1',
      front: isHinglish ? `"${data.concept}" ka kya matlab aur exam rule hai?` : `What is "${data.concept}" and its primary exam rule?`,
      back: `${data.definition}\n\nExam Note: ${data.mnemonic || (data.examTips?.[0] ?? '')}`,
      category: 'Concept Breakdown'
    });
    setFlashcardSaved(true);
    setTimeout(() => setFlashcardSaved(false), 3000);
  };

  const handleAddToNote = () => {
    if (!data || noteSaved) return;
    insertHighlightIntoNote({
      id: `hl-ai-${Date.now()}`,
      documentId: activeDocument?.id || 'doc-physics-1',
      text: `${data.concept}: ${data.definition}`,
      category: 'core',
      noteText: `Analogy: ${data.analogy} | Mnemonic: ${data.mnemonic}`,
      createdAt: new Date().toISOString()
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  };

  const handleSaveToVault = () => {
    if (!data || vaultSaved) return;
    addConceptVaultItem({
      concept: data.concept,
      subject: activeDocument?.subject || 'General',
      chapterTitle: activeDocument?.title,
      easyExplanation: data.definition,
      analogy: data.analogy,
      whyConfusing: data.examTips?.[0] || 'Frequently confused in exam questions.',
      keyRulesOrFormula: data.keyFormula || 'Standard formulation applies.',
      clarityLevel: 'getting_there'
    });
    setVaultSaved(true);
    setTimeout(() => setVaultSaved(false), 3000);
  };

  const handleSaveAsQuestion = () => {
    if (!data || questionSaved) return;
    addImportantQuestion({
      question: `Explain "${data.concept}" in detail with key governing rules and practical examples.`,
      subject: activeDocument?.subject || 'General',
      chapterTitle: activeDocument?.title,
      marks: 5,
      questionType: 'conceptual',
      importance: 'very_high',
      modelAnswer: `1. Definition:\n${data.definition}\n\n2. Real-World Principle & Analogy:\n${data.analogy}\n\n3. Key Exam Points to Secure Marks:\n${(data.examTips || []).map((t, i) => `${i + 1}. ${t}`).join('\n')}`,
      status: 'to_practice'
    });
    setQuestionSaved(true);
    setTimeout(() => setQuestionSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isHinglish ? 'AI Concept Explainer' : 'Concept Breakdown'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHinglish ? 'Asaan alfaaz aur exam tips ke sath' : 'Clear intuition, analogies & exam traps'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block mb-1 uppercase tracking-wider">
                {isHinglish ? 'Topic / Term' : 'Term Under Review'}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">"{concept}"</p>
            </div>

            {/* Quick Vault & Question Save Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveToVault}
                disabled={loading || !data}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all flex items-center gap-1 ${
                  vaultSaved
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50'
                }`}
                title="Save into Concept Clarity Vault"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{vaultSaved ? 'Vault Mein Saved!' : '+ Clarity Vault'}</span>
              </button>

              <button
                onClick={handleSaveAsQuestion}
                disabled={loading || !data}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all flex items-center gap-1 ${
                  questionSaved
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 hover:bg-rose-50'
                }`}
                title="Save as Important Exam Question"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{questionSaved ? 'Question Saved!' : '+ Save Question'}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-xs font-medium">
                {isHinglish ? 'Concept ko asaan alfaaz mein tayar kar rahe hain...' : 'Synthesizing simple intuition and exam tips...'}
              </p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Definition */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isHinglish ? 'Saaf & Seedhi Tareef (Definition)' : 'Core Definition'}</span>
                </h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {data.definition}
                </p>
              </div>

              {/* Analogy */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isHinglish ? 'Asaan Misal (Real-Life Analogy)' : 'Real-Life Analogy'}</span>
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                  {data.analogy}
                </p>
              </div>

              {/* Exam Traps & Tips */}
              {data.examTips && data.examTips.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>{isHinglish ? 'Exam Alert: Examiner Kahan Number Kaat-ta Hai?' : 'Exam Traps & Examiner Expectations'}</span>
                  </h3>
                  <ul className="space-y-1.5">
                    {data.examTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-rose-500/5 p-2 rounded-lg border border-rose-500/15"
                      >
                        <span className="font-mono text-rose-600 dark:text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mnemonic / Memory Hook */}
              {data.mnemonic && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {isHinglish ? 'Yaad Rakhne Ka Totka (Mnemonic Hook)' : 'Memory Hook / Mnemonic'}
                  </h3>
                  <div className="text-xs font-mono bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 p-2.5 rounded-lg">
                    {data.mnemonic}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-rose-500">{errorMsg || 'Could not load explanation.'}</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {isHinglish ? 'Band Karein' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToNote}
              disabled={loading || !data}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                noteSaved
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{noteSaved ? (isHinglish ? 'Notes Mein Added!' : 'Added to Notes!') : (isHinglish ? 'Notes Mein Dalein' : 'Add to Notes')}</span>
            </button>

            <button
              onClick={handleCreateFlashcard}
              disabled={loading || !data}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all ${
                flashcardSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{flashcardSaved ? (isHinglish ? 'Flashcard Ban Gaya!' : 'Saved to Flashcards!') : (isHinglish ? 'Flashcard Banayein' : 'Create Flashcard')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

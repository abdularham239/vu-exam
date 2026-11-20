import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudyDocument,
  ExamNote,
  Flashcard,
  Highlight,
  HighlightCategory,
  ImportantQuestion,
  ConceptVaultItem
} from '../types/study';
import {
  INITIAL_DOCUMENTS,
  INITIAL_NOTES,
  INITIAL_FLASHCARDS,
  INITIAL_IMPORTANT_QUESTIONS,
  INITIAL_CONCEPT_VAULT
} from '../data/defaultChapters';

export type ActiveTab = 'reader' | 'notes' | 'questions' | 'concepts' | 'flashcards' | 'quiz' | 'cheatsheet';

interface StudyContextType {
  documents: StudyDocument[];
  activeDocId: string;
  activeDocument: StudyDocument | null;
  setActiveDocId: (id: string) => void;
  addDocument: (doc: { title: string; subject: string; content: string; readTime?: string; coverImage?: string }) => StudyDocument;
  updateDocument: (id: string, updates: Partial<StudyDocument>) => void;
  deleteDocument: (id: string) => void;

  // Highlighting
  addHighlight: (docId: string, highlight: { text: string; category: HighlightCategory; noteText?: string }) => Highlight;
  removeHighlight: (docId: string, highlightId: string) => void;
  updateHighlight: (docId: string, highlightId: string, updates: Partial<Highlight>) => void;

  // Exam Notes
  notes: ExamNote[];
  activeNoteId: string | null;
  activeNote: ExamNote | null;
  setActiveNoteId: (id: string | null) => void;
  createNote: (docId?: string, title?: string) => ExamNote;
  updateNote: (id: string, updates: Partial<ExamNote>) => void;
  deleteNote: (id: string) => void;
  insertHighlightIntoNote: (highlight: Highlight) => void;

  // Important Questions
  importantQuestions: ImportantQuestion[];
  addImportantQuestion: (q: Omit<ImportantQuestion, 'id' | 'createdAt'>) => ImportantQuestion;
  updateImportantQuestion: (id: string, updates: Partial<ImportantQuestion>) => void;
  deleteImportantQuestion: (id: string) => void;
  markQuestionStatus: (id: string, status: 'to_practice' | 'writing_practiced' | 'mastered') => void;

  // Concept Clarity Vault
  conceptVault: ConceptVaultItem[];
  addConceptVaultItem: (item: Omit<ConceptVaultItem, 'id' | 'createdAt' | 'updatedAt'>) => ConceptVaultItem;
  updateConceptVaultItem: (id: string, updates: Partial<ConceptVaultItem>) => void;
  deleteConceptVaultItem: (id: string) => void;
  setClarityLevel: (id: string, level: 'confused' | 'getting_there' | 'crystal_clear') => void;

  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (card: { documentId: string; front: string; back: string; category?: string }) => Flashcard;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, rating: 'again' | 'good' | 'easy') => void;

  // Global Navigation & UX
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'hinglish' | 'english';
  setLanguage: (lang: 'hinglish' | 'english') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Pomodoro Study Timer
  pomodoro: {
    timeLeft: number;
    isRunning: boolean;
    mode: 'study' | 'short_break' | 'long_break';
    totalStudySessions: number;
    start: () => void;
    pause: () => void;
    reset: () => void;
    setMode: (m: 'study' | 'short_break' | 'long_break') => void;
  };

  // Import / Export
  exportAllData: () => void;
  importAllData: (jsonStr: string) => boolean;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DOCS: 'medha_study_docs_v3',
  NOTES: 'medha_exam_notes_v3',
  FLASHCARDS: 'medha_flashcards_v3',
  QUESTIONS: 'medha_important_questions_v3',
  CONCEPTS: 'medha_concept_vault_v3',
  LANG: 'medha_study_lang_v3',
  DARK: 'medha_study_dark_v3'
};

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK);
    if (saved !== null) return saved === 'true';
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK, darkMode ? 'true' : 'false');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Language state
  const [language, setLanguageState] = useState<'hinglish' | 'english'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as 'hinglish' | 'english') || 'hinglish';
  });

  const setLanguage = (lang: 'hinglish' | 'english') => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');

  // Documents
  const [documents, setDocuments] = useState<StudyDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved docs', e);
      }
    }
    return INITIAL_DOCUMENTS;
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => {
    return documents[0]?.id || 'doc-physics-1';
  });

  const activeDocument = documents.find(d => d.id === activeDocId) || documents[0] || null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documents));
  }, [documents]);

  const addDocument = (doc: { title: string; subject: string; content: string; readTime?: string; coverImage?: string }): StudyDocument => {
    const newDoc: StudyDocument = {
      id: `doc-${Date.now()}`,
      title: doc.title || 'Untitled Chapter',
      subject: doc.subject || 'General Study',
      readTime: doc.readTime || `${Math.max(1, Math.ceil(doc.content.split(/\s+/).length / 180))} min read`,
      coverImage: doc.coverImage,
      content: doc.content,
      highlights: [],
      tags: [doc.subject || 'Study'],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<StudyDocument>) => {
    setDocuments(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : d))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => {
      const filtered = prev.filter(d => d.id !== id);
      if (activeDocId === id && filtered.length > 0) {
        setActiveDocId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Highlighting
  const addHighlight = (docId: string, highlightData: { text: string; category: HighlightCategory; noteText?: string }): Highlight => {
    const newHl: Highlight = {
      id: `hl-${Date.now()}`,
      documentId: docId,
      text: highlightData.text,
      category: highlightData.category,
      noteText: highlightData.noteText || '',
      createdAt: new Date().toISOString()
    };

    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          const exists = doc.highlights.some(h => h.text.trim() === highlightData.text.trim());
          if (exists) return doc;
          return {
            ...doc,
            highlights: [newHl, ...doc.highlights]
          };
        }
        return doc;
      })
    );

    return newHl;
  };

  const removeHighlight = (docId: string, highlightId: string) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            highlights: doc.highlights.filter(h => h.id !== highlightId)
          };
        }
        return doc;
      })
    );
  };

  const updateHighlight = (docId: string, highlightId: string, updates: Partial<Highlight>) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            highlights: doc.highlights.map(h => (h.id === highlightId ? { ...h, ...updates } : h))
          };
        }
        return doc;
      })
    );
  };

  // Exam Notes
  const [notes, setNotes] = useState<ExamNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse notes', e);
      }
    }
    return INITIAL_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    return notes[0]?.id || null;
  });

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0] || null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  const createNote = (docId?: string, title?: string): ExamNote => {
    const parentDoc = docId ? documents.find(d => d.id === docId) : activeDocument;
    const newNote: ExamNote = {
      id: `note-${Date.now()}`,
      documentId: parentDoc ? parentDoc.id : (activeDocument?.id || 'general'),
      title: title || `${parentDoc?.title || 'Chapter'} - Exam Notes`,
      subject: parentDoc?.subject || 'Exam Preparation',
      cues: [
        'Main concept or principle?',
        'Formulas / equations to memorize?',
        'High-probability exam question?'
      ],
      notes: `### ${parentDoc?.title || 'Study Topic'}\n\n- Key definitions and core observations:\n- Step-by-step logic:\n- Important exceptions or boundary conditions:`,
      summary: 'Summary of the most vital takeaways to review 24 hours prior to the exam.',
      tags: ['Exam Prep', parentDoc?.subject || 'Study'],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<ExamNote>) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const filtered = prev.filter(n => n.id !== id);
      if (activeNoteId === id && filtered.length > 0) {
        setActiveNoteId(filtered[0].id);
      }
      return filtered;
    });
  };

  const insertHighlightIntoNote = (highlight: Highlight) => {
    let targetNote = activeNote;
    if (!targetNote) {
      targetNote = createNote(highlight.documentId);
    }

    const appendText = `\n- **[${highlight.category.toUpperCase()}]**: "${highlight.text}"${
      highlight.noteText ? ` — *Note: ${highlight.noteText}*` : ''
    }`;

    updateNote(targetNote.id, {
      notes: targetNote.notes + appendText
    });
  };

  // Important Questions
  const [importantQuestions, setImportantQuestions] = useState<ImportantQuestion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse questions', e);
      }
    }
    return INITIAL_IMPORTANT_QUESTIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(importantQuestions));
  }, [importantQuestions]);

  const addImportantQuestion = (qData: Omit<ImportantQuestion, 'id' | 'createdAt'>): ImportantQuestion => {
    const newQ: ImportantQuestion = {
      ...qData,
      id: `iq-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setImportantQuestions(prev => [newQ, ...prev]);
    return newQ;
  };

  const updateImportantQuestion = (id: string, updates: Partial<ImportantQuestion>) => {
    setImportantQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteImportantQuestion = (id: string) => {
    setImportantQuestions(prev => prev.filter(q => q.id !== id));
  };

  const markQuestionStatus = (id: string, status: 'to_practice' | 'writing_practiced' | 'mastered') => {
    updateImportantQuestion(id, { status });
  };

  // Concept Clarity Vault
  const [conceptVault, setConceptVault] = useState<ConceptVaultItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONCEPTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse concept vault', e);
      }
    }
    return INITIAL_CONCEPT_VAULT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(conceptVault));
  }, [conceptVault]);

  const addConceptVaultItem = (itemData: Omit<ConceptVaultItem, 'id' | 'createdAt' | 'updatedAt'>): ConceptVaultItem => {
    const newItem: ConceptVaultItem = {
      ...itemData,
      id: `cv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setConceptVault(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateConceptVaultItem = (id: string, updates: Partial<ConceptVaultItem>) => {
    setConceptVault(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteConceptVaultItem = (id: string) => {
    setConceptVault(prev => prev.filter(c => c.id !== id));
  };

  const setClarityLevel = (id: string, level: 'confused' | 'getting_there' | 'crystal_clear') => {
    updateConceptVaultItem(id, { clarityLevel: level });
  };

  // Flashcards
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse flashcards', e);
      }
    }
    return INITIAL_FLASHCARDS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
  }, [flashcards]);

  const addFlashcard = (card: { documentId: string; front: string; back: string; category?: string }): Flashcard => {
    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      documentId: card.documentId,
      front: card.front,
      back: card.back,
      category: card.category || 'General Concept',
      status: 'new',
      reviewCount: 0
    };
    setFlashcards(prev => [newCard, ...prev]);
    return newCard;
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards(prev => prev.map(fc => (fc.id === id ? { ...fc, ...updates } : fc)));
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(fc => fc.id !== id));
  };

  const reviewFlashcard = (id: string, rating: 'again' | 'good' | 'easy') => {
    setFlashcards(prev =>
      prev.map(fc => {
        if (fc.id !== id) return fc;
        const newCount = fc.reviewCount + 1;
        let newStatus: 'new' | 'learning' | 'mastered' = fc.status;
        if (rating === 'again') newStatus = 'learning';
        else if (rating === 'good') newStatus = 'learning';
        else if (rating === 'easy') newStatus = 'mastered';

        return {
          ...fc,
          status: newStatus,
          reviewCount: newCount,
          lastReviewed: new Date().toISOString()
        };
      })
    );
  };

  // Pomodoro Timer State
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomoRunning && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (pomoRunning && pomoTimeLeft === 0) {
      setPomoRunning(false);
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } catch (e) {}

      if (pomoMode === 'study') {
        setTotalSessions(s => s + 1);
        setPomoMode('short_break');
        setPomoTimeLeft(5 * 60);
      } else {
        setPomoMode('study');
        setPomoTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomoRunning, pomoTimeLeft, pomoMode]);

  const startPomo = () => setPomoRunning(true);
  const pausePomo = () => setPomoRunning(false);
  const resetPomo = () => {
    setPomoRunning(false);
    if (pomoMode === 'study') setPomoTimeLeft(25 * 60);
    else if (pomoMode === 'short_break') setPomoTimeLeft(5 * 60);
    else setPomoTimeLeft(15 * 60);
  };
  const switchPomoMode = (m: 'study' | 'short_break' | 'long_break') => {
    setPomoMode(m);
    setPomoRunning(false);
    if (m === 'study') setPomoTimeLeft(25 * 60);
    else if (m === 'short_break') setPomoTimeLeft(5 * 60);
    else setPomoTimeLeft(15 * 60);
  };

  // Export / Import
  const exportAllData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      documents,
      notes,
      importantQuestions,
      conceptVault,
      flashcards
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medha_Study_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importAllData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.documents && Array.isArray(data.documents)) {
        setDocuments(data.documents);
      }
      if (data.notes && Array.isArray(data.notes)) {
        setNotes(data.notes);
      }
      if (data.importantQuestions && Array.isArray(data.importantQuestions)) {
        setImportantQuestions(data.importantQuestions);
      }
      if (data.conceptVault && Array.isArray(data.conceptVault)) {
        setConceptVault(data.conceptVault);
      }
      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <StudyContext.Provider
      value={{
        documents,
        activeDocId,
        activeDocument,
        setActiveDocId,
        addDocument,
        updateDocument,
        deleteDocument,
        addHighlight,
        removeHighlight,
        updateHighlight,
        notes,
        activeNoteId,
        activeNote,
        setActiveNoteId,
        createNote,
        updateNote,
        deleteNote,
        insertHighlightIntoNote,
        importantQuestions,
        addImportantQuestion,
        updateImportantQuestion,
        deleteImportantQuestion,
        markQuestionStatus,
        conceptVault,
        addConceptVaultItem,
        updateConceptVaultItem,
        deleteConceptVaultItem,
        setClarityLevel,
        flashcards,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        reviewFlashcard,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        darkMode,
        toggleDarkMode,
        pomodoro: {
          timeLeft: pomoTimeLeft,
          isRunning: pomoRunning,
          mode: pomoMode,
          totalStudySessions: totalSessions,
          start: startPomo,
          pause: pausePomo,
          reset: resetPomo,
          setMode: switchPomoMode
        },
        exportAllData,
        importAllData
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return ctx;
};

export type HighlightCategory = 'core' | 'formula' | 'exam' | 'example' | 'quick_fact';

export interface HighlightCategoryMeta {
  id: HighlightCategory;
  label: string;
  hinglishLabel: string;
  badgeClass: string;
  borderClass: string;
  dotColor: string;
  description: string;
}

export const HIGHLIGHT_CATEGORIES: Record<HighlightCategory, HighlightCategoryMeta> = {
  core: {
    id: 'core',
    label: 'Core Definition',
    hinglishLabel: 'Asal Tareef / Concept',
    badgeClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    borderClass: 'border-l-amber-500',
    dotColor: '#eab308',
    description: 'Foundational concept or definition'
  },
  formula: {
    id: 'formula',
    label: 'Formula / Law',
    hinglishLabel: 'Qanoon ya Formula',
    badgeClass: 'bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-200 border-sky-300 dark:border-sky-800',
    borderClass: 'border-l-sky-500',
    dotColor: '#0284c7',
    description: 'Mathematical equation, law, or theorem'
  },
  exam: {
    id: 'exam',
    label: 'High Exam Prob',
    hinglishLabel: 'Exam ke liye Bohat Zaroori',
    badgeClass: 'bg-rose-100 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800',
    borderClass: 'border-l-rose-500',
    dotColor: '#dc2626',
    description: 'Extremely likely to appear in upcoming exams'
  },
  example: {
    id: 'example',
    label: 'Key Example',
    hinglishLabel: 'Misal ya Practical Case',
    badgeClass: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
    borderClass: 'border-l-emerald-500',
    dotColor: '#16a34a',
    description: 'Real-world example or calculation illustration'
  },
  quick_fact: {
    id: 'quick_fact',
    label: 'Quick Revision Fact',
    hinglishLabel: 'Yaad Rakhne Wali Baat',
    badgeClass: 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-200 border-purple-300 dark:border-purple-800',
    borderClass: 'border-l-purple-500',
    dotColor: '#9333ea',
    description: 'One-liner fact or unit or constant'
  }
};

export interface Highlight {
  id: string;
  documentId: string;
  text: string;
  category: HighlightCategory;
  noteText?: string;
  createdAt: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  subject: string;
  readTime: string;
  coverImage?: string;
  content: string;
  highlights: Highlight[];
  tags: string[];
  updatedAt: string;
}

export interface ExamNote {
  id: string;
  documentId: string;
  title: string;
  subject: string;
  cues: string[]; // Cornell Cue column
  notes: string; // Cornell Notes content (markdown/text)
  summary: string; // Cornell 24-hr revision summary
  tags: string[];
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  documentId: string;
  front: string;
  back: string;
  category: string;
  status: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewed?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
  difficulty: string;
}

export interface ConceptExplanation {
  concept: string;
  definition: string;
  analogy: string;
  examTips: string[];
  mnemonic: string;
  keyFormula?: string;
}

// Important Question Saver Type
export interface ImportantQuestion {
  id: string;
  documentId?: string;
  subject: string;
  chapterTitle?: string;
  question: string;
  marks: number; // e.g. 2, 3, 5, 8, 10
  questionType: 'short' | 'long' | 'numerical' | 'conceptual' | 'viva';
  importance: 'very_high' | 'high' | 'medium';
  frequency?: string; // e.g. "Board Exam 2024, 2022 (Repeated 3x)"
  modelAnswer: string;
  keyPoints?: string[];
  status: 'to_practice' | 'writing_practiced' | 'mastered';
  createdAt: string;
}

// Concept Clarity Vault Item Type
export interface ConceptVaultItem {
  id: string;
  documentId?: string;
  subject: string;
  chapterTitle?: string;
  concept: string;
  easyExplanation: string; // Asaan alfaaz mein samajh
  analogy: string; // Asaan misal / Everyday life analogy
  whyConfusing: string; // Where students get confused / common confusion
  keyRulesOrFormula: string; // Formula or rule
  myOwnNotes?: string; // Student's own notes / understanding
  clarityLevel: 'confused' | 'getting_there' | 'crystal_clear';
  createdAt: string;
  updatedAt: string;
}

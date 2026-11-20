import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { X, Plus, BookOpen, FileText } from 'lucide-react';

interface NewChapterModalProps {
  onClose: () => void;
}

export const NewChapterModal: React.FC<NewChapterModalProps> = ({ onClose }) => {
  const { addDocument, setActiveTab, language } = useStudy();
  const isHinglish = language === 'hinglish';

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [content, setContent] = useState('');

  const sampleTemplates = [
    {
      title: 'Thermodynamics & Heat Transfer',
      subject: 'Physics',
      text: `## 1. The Zeroth and First Law of Thermodynamics

Thermodynamics is the study of heat, work, temperature, and their relation to energy.

The First Law states: ΔU = Q - W
Where:
- ΔU is the change in internal energy
- Q is heat added to the system
- W is work done by the system

### Exam Trap:
Work done during an isothermal expansion of an ideal gas is W = n·R·T · ln(Vf / Vi). Since temperature is constant, ΔU = 0, so Q = W.`
    },
    {
      title: 'Genetics & Mendelian Inheritance',
      subject: 'Biology',
      text: `## 1. Principles of Inheritance

Gregor Mendel established the fundamental laws of inheritance through hybridization experiments with garden peas (Pisum sativum).

### 1. Law of Segregation
Alleles of a gene separate during gamete formation so that each gamete carries only one allele for each gene.

### 2. Law of Independent Assortment
Alleles of two or more different genes assort independently of each other during gamete formation, resulting in a standard 9:3:3:1 dihybrid phenotypic ratio.`
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addDocument({
      title: title.trim(),
      subject: subject.trim(),
      content: content.trim()
    });

    setActiveTab('reader');
    onClose();
  };

  const handleUseTemplate = (tmpl: typeof sampleTemplates[0]) => {
    setTitle(tmpl.title);
    setSubject(tmpl.subject);
    setContent(tmpl.text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isHinglish ? 'Naya Chapter / Study Material Shamil Karein' : 'Add Study Material or Syllabus'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Fill */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
            {isHinglish ? 'Ya Sample Chapter Load Karein:' : 'Or Quick-load a Sample Chapter:'}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {sampleTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleUseTemplate(tmpl)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-colors"
              >
                + {tmpl.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isHinglish ? 'Chapter / Topic Ka Naam' : 'Chapter / Topic Title'}
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isHinglish ? 'e.g. Chapter 4: Thermodynamics' : 'e.g. Molecular Genetics'}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isHinglish ? 'Mazmoon (Subject)' : 'Subject'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Physics, Bio, Math..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isHinglish ? 'Chapter Ka Text / Notes Paste Karein' : 'Paste Study Material / Chapter Content'}
            </label>
            <textarea
              required
              rows={9}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isHinglish ? 'Apni kitaab, notes, ya syllabus ka text yahan paste karein...' : 'Paste textbook paragraphs, lecture notes, or syllabus content here...'}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHinglish ? 'Save Karein & Parhna Shuru Karein' : 'Save & Open in Reader'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

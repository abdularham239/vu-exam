import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to sanitize markdown/code fences from model output if needed
function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([
    promise.then(val => {
      clearTimeout(timer);
      return val;
    }).catch(() => fallback),
    timeoutPromise
  ]);
}

// 1. Explain Concept API
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  const { concept, context, language = 'hinglish' } = req.body;

  if (!concept || typeof concept !== 'string') {
    return res.status(400).json({ error: 'Concept text is required' });
  }

  if (!ai) {
    // Intelligent offline fallback
    return res.json({
      concept,
      definition: `${concept} is a fundamental exam topic requiring precise understanding of its core rules and applications.`,
      analogy: `Think of it like an everyday system where inputs reliably determine outputs under fixed conditions.`,
      examTips: [
        `Always write the exact definition along with its standard formula or diagram in the exam.`,
        `Examiners frequently test edge cases and boundary conditions for ${concept}.`,
        `Mention SI units and standard notation to secure full marks.`
      ],
      mnemonic: `Focus on the core 3 steps: Identity -> Formulation -> Proof.`,
      keyFormula: `Standard Form / Law of ${concept}`
    });
  }

  try {
    const isHinglish = language === 'hinglish';
    const langInstruction = isHinglish
      ? 'Explain in Hinglish (conversational Roman Urdu/Hindi mixed with English technical terms, which is extremely popular and easy for students in South Asia to understand).'
      : 'Explain in clear, encouraging English with precise academic clarity.';

    const systemPrompt = `You are a world-class exam coach and academic mentor.
Your job is to explain complex concepts so clearly that a student can remember them in the exam hall.
${langInstruction}
Return a structured JSON object with:
- "definition": A 1-2 sentence punchy definition.
- "analogy": A super relatable real-life analogy (Asaan Misal).
- "examTips": Array of 3 specific tips on how examiners ask questions on this and common student mistakes to avoid.
- "mnemonic": A short memory hook or mnemonic trick to remember it.
- "keyFormula": Optional formula or core law statement if applicable.`;

    const userPrompt = `Concept to explain: "${concept}".
Context from study material: "${(context || '').slice(0, 800)}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            analogy: { type: Type.STRING },
            examTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            mnemonic: { type: Type.STRING },
            keyFormula: { type: Type.STRING }
          },
          required: ['definition', 'analogy', 'examTips', 'mnemonic']
        }
      }
    });

    const parsed = JSON.parse(cleanJsonResponse(response.text || '{}'));
    return res.json({ concept, ...parsed });
  } catch (err: any) {
    console.error('Error or high demand in concept explanation:', err);
    // Provide high-yield structured fallback so the student is never blocked
    return res.json({
      concept,
      definition: `${concept} is a foundational principle and exam concept that defines key behaviors and state transformations.`,
      analogy: `Think of it like an everyday system where standard rules dictate outputs predictably under given boundary conditions.`,
      examTips: [
        `Always state the formal definition along with relevant standard SI units in your answer sheet.`,
        `Examiners frequently test boundary conditions, assumptions, and edge cases for ${concept}.`,
        `Draw a neat sketch, diagram, or state the exact formula to guarantee full step-marks.`
      ],
      mnemonic: `Formula + Definition + Example = Full Marks!`,
      keyFormula: `Standard Formulation of ${concept}`
    });
  }
});

// 2. Generate Practice Exam Quiz API
app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
  const { chapterTitle, content, highlights = [], count = 5 } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Chapter content is required' });
  }

  if (!ai) {
    return res.json({
      questions: [
        {
          id: 'q1',
          question: `What is the primary governing principle discussed in "${chapterTitle || 'this chapter'}"?`,
          options: [
            'Direct empirical observation and standard laws',
            'Arbitrary random fluctuations without correlation',
            'Purely theoretical assumption with no physical proof',
            'Unrelated mathematical axioms'
          ],
          correctIndex: 0,
          explanation: `The foundational concepts in this section depend on verified physical/computational laws that explain system dynamics.`,
          conceptTag: 'Core Principle',
          difficulty: 'Medium'
        }
      ]
    });
  }

  try {
    const prompt = `You are a senior exam question creator for university and competitive board examinations.
Create ${count} high-yield exam practice questions based strictly on this study chapter and key highlights.
Chapter: "${chapterTitle}"
Key Highlights: ${JSON.stringify(highlights.slice(0, 8))}
Text Excerpt: "${content.slice(0, 3000)}"

Return a JSON array of questions where each object has:
- "question": Clear, challenging exam question (conceptual, scenario-based, or formula application).
- "options": Exactly 4 plausible choices.
- "correctIndex": Integer (0, 1, 2, or 3) indicating the single correct option.
- "explanation": Concise breakdown explaining why the correct choice is right and where common distractors mislead students.
- "conceptTag": Short tag (e.g. "Newton's 2nd Law", "Mitochondria", "Big-O").
- "difficulty": "Easy" | "Medium" | "High-Yield Exam"`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              conceptTag: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctIndex', 'explanation', 'conceptTag', 'difficulty']
          }
        }
      }
    });

    const questions = JSON.parse(cleanJsonResponse(response.text || '[]'));
    const formatted = questions.map((q: any, idx: number) => ({
      ...q,
      id: `ai-q-${Date.now()}-${idx}`
    }));

    return res.json({ questions: formatted });
  } catch (err: any) {
    console.error('Error generating quiz:', err);
    return res.json({
      questions: [
        {
          id: `q-fallback-1`,
          question: `Which fundamental principle is central to understanding "${chapterTitle || 'this topic'}"?`,
          options: [
            'Empirical conservation laws and standard governing formulas',
            'Arbitrary random changes with zero correlation',
            'Untestable theoretical assumptions',
            'Unrelated peripheral variables'
          ],
          correctIndex: 0,
          explanation: `Systematic exam answers require grounding in fundamental conservation laws and verified governing equations.`,
          conceptTag: 'Core Principle',
          difficulty: 'High-Yield Exam'
        },
        {
          id: `q-fallback-2`,
          question: `What is the most frequent trap students encounter when answering numerical problems in this section?`,
          options: [
            'Forgetting standard SI unit conversions and vector signs',
            'Writing definitions in too much detail',
            'Using standard physical constants',
            'Applying mathematical formulas correctly'
          ],
          correctIndex: 0,
          explanation: `Examiners test whether students convert units (e.g., cm to m, or km/h to m/s) and maintain vector direction consistency.`,
          conceptTag: 'Exam Trap',
          difficulty: 'Medium'
        }
      ]
    });
  }
});

// 3. Generate Flashcards API
app.post('/api/ai/generate-flashcards', async (req: Request, res: Response) => {
  const { chapterTitle, content, highlights = [] } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  if (!ai) {
    return res.json({
      flashcards: [
        {
          front: `What is the key takeaway of ${chapterTitle || 'this topic'}?`,
          back: `Review the foundational definitions and highlighted formulas before taking the test.`,
          category: 'Key Concept'
        }
      ]
    });
  }

  try {
    const prompt = `Create 6 high-impact active recall flashcards for exam preparation.
Chapter: "${chapterTitle}"
Highlighted Points: ${JSON.stringify(highlights.slice(0, 10))}
Content: "${content.slice(0, 2500)}"

Return a JSON array of flashcards with:
- "front": Clear prompt/question/formula challenge.
- "back": High-yield, concise answer with key terms bolded or clearly distinguished.
- "category": e.g. "Definition", "Formula", "Mechanism", "Exam Difference"`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ['front', 'back', 'category']
          }
        }
      }
    });

    const cards = JSON.parse(cleanJsonResponse(response.text || '[]'));
    return res.json({ flashcards: cards });
  } catch (err: any) {
    console.error('Error generating flashcards:', err);
    return res.json({
      flashcards: [
        {
          front: `What is the key governing law or definition in "${chapterTitle || 'this topic'}"?`,
          back: `Review the highlighted core rules and formulas from this chapter before taking the exam.`,
          category: 'Key Principle'
        },
        {
          front: `What is the most crucial formula or equation to memorize for ${chapterTitle || 'this section'}?`,
          back: `Write down all variables, standard SI units, and boundary conditions to secure full step marks.`,
          category: 'Formula'
        }
      ]
    });
  }
});

// 4. Summarize into Cornell Note API
app.post('/api/ai/summarize-cornell', async (req: Request, res: Response) => {
  const { chapterTitle, content, highlights = [] } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  if (!ai) {
    return res.json({
      cues: [
        'What are the foundational principles?',
        'Which formulas or laws are tested most?',
        'What common misconceptions exist?'
      ],
      notes: `### ${chapterTitle}\n\n- **Core Theme**: Focused study of key laws and mechanisms.\n- **Crucial Equations**: Review mathematical relations and units.\n- **Key Takeaways**: Understand conceptual derivations and practical examples.`,
      summary: `Master the basic formulas and clear definitions to achieve top scores in ${chapterTitle}.`
    });
  }

  try {
    const prompt = `Synthesize the provided study material into a structured Cornell Exam Revision Note.
Chapter: "${chapterTitle}"
Highlights: ${JSON.stringify(highlights.slice(0, 12))}
Content: "${content.slice(0, 3000)}"

Return a JSON object with:
- "cues": Array of 5-7 exam cue questions / keywords that test understanding.
- "notes": Markdown formatted notes covering the major mechanisms, laws, and points in clean bullet points.
- "summary": A 3-4 sentence rapid exam recap specifically tailored for last-minute 24-hour review.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cues: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            notes: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ['cues', 'notes', 'summary']
        }
      }
    });

    const result = JSON.parse(cleanJsonResponse(response.text || '{}'));
    return res.json(result);
  } catch (err: any) {
    console.error('Error generating Cornell note:', err);
    return res.json({
      cues: [
        `What is the primary law or mechanism in ${chapterTitle}?`,
        `Which equations are most frequently tested in the exam?`,
        `What common sign or unit errors should be avoided?`
      ],
      notes: `### ${chapterTitle} - Core Exam Points\n\n- **Foundations**: Review key definitions, standard conventions, and underlying assumptions.\n- **Equations**: Pay special attention to standard SI units and dimensional consistency.\n- **Pitfalls**: Action-reaction pairs act on different objects; convert all units before calculating!`,
      summary: `Focus on precise definitions and step-by-step problem-solving. Practice drawing free diagrams and checking units.`
    });
  }
});

// 5. Generate Model Answer for Important Question API
app.post('/api/ai/model-answer', async (req: Request, res: Response) => {
  const { question, subject = 'General', marks = 5, chapterTitle } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!ai) {
    return res.json({
      modelAnswer: `1. Definition & Core Principle: Clearly state the formal law and boundary conditions.\n2. Step-by-Step Derivation / Formulation: Write mathematical equations showing each algebraic step.\n3. Example & Application: Connect with physical system.\n4. Standard SI Units and Notation: Ensure all variables are defined.`,
      keyPoints: [
        'Formal definition with keywords',
        'Step-by-step mathematical reasoning',
        'State standard SI units and notation'
      ],
      markingSchemeTips: 'Write neatly with bold headings; step-marks are awarded for formula, calculation, and final unit.'
    });
  }

  try {
    const prompt = `You are a strict examiner who prepares marking schemes and model answers for board and university exams.
Create an exam-ready model answer for this ${marks}-mark question in ${subject}:
Question: "${question}"
Chapter: "${chapterTitle || subject}"

Return a JSON object with:
- "modelAnswer": Full, well-structured answer formatted in clear numbered points or headings that would secure 100% of the marks.
- "keyPoints": Array of 3-4 bullet points highlighting what the examiner looks for.
- "markingSchemeTips": Concise tip on how marks are distributed (e.g. 1 mark definition, 2 marks derivation, 1 mark units).`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modelAnswer: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            markingSchemeTips: { type: Type.STRING }
          },
          required: ['modelAnswer', 'keyPoints', 'markingSchemeTips']
        }
      }
    });

    const result = JSON.parse(cleanJsonResponse(response.text || '{}'));
    return res.json(result);
  } catch (err) {
    console.error('Error generating model answer:', err);
    return res.json({
      modelAnswer: `1. Formal Definition: Define the core terms accurately.\n2. Key Equation: State the mathematical relationship.\n3. Step Derivation: Expand step-by-step without skipping steps.\n4. Conclusion: State standard units and physical significance.`,
      keyPoints: [
        'State precise definitions',
        'Include governing formulas and units',
        'Avoid skipping intermediate algebraic steps'
      ],
      markingSchemeTips: 'Allocate 1-2 marks for definition, 2 marks for derivation/steps, and 1 mark for correct final units.'
    });
  }
});

// 6. Deep Concept Clarity Generator API
app.post('/api/ai/concept-clarity', async (req: Request, res: Response) => {
  const { concept, subject = 'General', chapterTitle, language = 'hinglish' } = req.body;
  if (!concept) {
    return res.status(400).json({ error: 'Concept is required' });
  }

  if (!ai) {
    return res.json({
      easyExplanation: `${concept} ko seedhi zubaan mein samjhein: yeh ek bunyadi qanoon hai jo system ke behaviour ko govern karta hai.`,
      analogy: `Jaise gaadi chalate waqt accelerator dabane se speed barhti hai, waise hi input badhane se output directly change hota hai.`,
      whyConfusing: `Bache aksar boundary conditions aur vector directions mein galti kar dete hain.`,
      keyRulesOrFormula: `Rule: Check conditions first, apply standard formula, always write units.`
    });
  }

  try {
    const isHinglish = language === 'hinglish';
    const langInstr = isHinglish
      ? 'Explain in conversational Hinglish / Roman Urdu mixed with clear English technical terms.'
      : 'Explain in crystal clear English.';

    const prompt = `You are an elite tutor who specializes in clearing deep student confusions and making hard concepts intuitive.
${langInstr}
Concept: "${concept}"
Subject: "${subject}"
Chapter: "${chapterTitle || ''}"

Return a JSON object with:
- "easyExplanation": Asaan aur seedhi zubaan mein samajh (2-3 sentences).
- "analogy": A relatable real-life analogy that makes the concept click instantly.
- "whyConfusing": Exactly where students get confused, common misconceptions, and why they get it wrong in exams.
- "keyRulesOrFormula": The exact mathematical formula, rule, or boundary condition to remember.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            easyExplanation: { type: Type.STRING },
            analogy: { type: Type.STRING },
            whyConfusing: { type: Type.STRING },
            keyRulesOrFormula: { type: Type.STRING }
          },
          required: ['easyExplanation', 'analogy', 'whyConfusing', 'keyRulesOrFormula']
        }
      }
    });

    const result = JSON.parse(cleanJsonResponse(response.text || '{}'));
    return res.json(result);
  } catch (err) {
    console.error('Error generating concept clarity:', err);
    return res.json({
      easyExplanation: `${concept} ek bunyadi concept hai. Isko step-by-step samjhein bina ratta lagaye.`,
      analogy: `Real-life system se compare karein: inputs aur outputs ke darmiyan correlation hamesha constant rehti hai.`,
      whyConfusing: `Examiners aksar edge cases aur negative signs par test karte hain jahan aksar confusion hoti hai.`,
      keyRulesOrFormula: `Standard formulation and SI units must be remembered.`
    });
  }
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

import { StudyDocument, ExamNote, Flashcard, QuizQuestion, ImportantQuestion, ConceptVaultItem } from '../types/study';

export const INITIAL_DOCUMENTS: StudyDocument[] = [
  {
    id: 'doc-physics-1',
    title: "Newton's Laws of Motion & Orbital Gravitation",
    subject: 'Physics',
    readTime: '8 min read',
    coverImage: '/src/assets/images/physics_mechanics_study_1795184015248.jpg',
    tags: ['Mechanics', 'Forces', 'Newton', 'Gravitation'],
    updatedAt: '2026-11-20',
    highlights: [
      {
        id: 'hl-1',
        documentId: 'doc-physics-1',
        text: 'A body remains at rest, or in uniform motion in a straight line, unless acted upon by a resultant external force.',
        category: 'core',
        noteText: 'Newton 1st Law (Law of Inertia) - Mass is the direct quantitative measure of inertia.',
        createdAt: '2026-11-20T06:00:00.000Z'
      },
      {
        id: 'hl-2',
        documentId: 'doc-physics-1',
        text: 'F = m · a (Force equals mass times acceleration)',
        category: 'formula',
        noteText: 'SI Unit: Newton (N) = kg·m/s². Vector equation! F_net = dp/dt in general.',
        createdAt: '2026-11-20T06:01:00.000Z'
      },
      {
        id: 'hl-3',
        documentId: 'doc-physics-1',
        text: 'Action and reaction forces act on two DIFFERENT bodies, never on the same body.',
        category: 'exam',
        noteText: 'Common Exam Trap: Action-reaction pairs NEVER cancel each other out because they act on separate objects.',
        createdAt: '2026-11-20T06:02:00.000Z'
      },
      {
        id: 'hl-4',
        documentId: 'doc-physics-1',
        text: 'F_g = G · (M · m) / r²',
        category: 'formula',
        noteText: 'Universal Law of Gravitation. G = 6.674 × 10^-11 N·m²/kg².',
        createdAt: '2026-11-20T06:03:00.000Z'
      },
      {
        id: 'hl-5',
        documentId: 'doc-physics-1',
        text: 'Orbital velocity of a satellite near Earth surface is v = sqrt(GM / r) ≈ 7.9 km/s.',
        category: 'quick_fact',
        noteText: 'Does NOT depend on the mass of the satellite (m cancels out).',
        createdAt: '2026-11-20T06:04:00.000Z'
      }
    ],
    content: `## 1. Classical Dynamics and Inertia

Newtonian mechanics forms the bedrock of classical physics. The behavior of bodies under applied forces is governed by three fundamental principles formulated by Sir Isaac Newton.

The First Law states that a body remains at rest, or in uniform motion in a straight line, unless acted upon by a resultant external force. This property of resisting changes in the state of motion is known as inertia. A heavier object has greater inertia, meaning mass is the intrinsic quantitative measure of inertia.

### Real-Life Application
When a bus driver brakes suddenly, passengers lurch forward because their upper bodies tend to maintain their forward velocity in accordance with the first law.

---

## 2. The Second Law: Quantitative Force and Momentum

Newton's Second Law provides the quantitative relationship between the net applied force and the kinematic change of the object. Formally, the rate of change of linear momentum of a body is directly proportional to the applied resultant force and occurs along the line of action of that force.

For an object with constant mass:
F = m · a (Force equals mass times acceleration)

Where:
- F is the net external force measured in Newtons (N = kg·m/s²)
- m is the inertial mass (kg)
- a is the resulting acceleration vector (m/s²)

### Exam Tip for Numerical Questions
Always draw a Free-Body Diagram (FBD) showing all forces acting on the system before applying ΣF = m·a along orthogonal axes (x and y).

---

## 3. The Third Law: Mutual Interactions

To every action, there is always an equal and opposite reaction.
Mathematically, if body A exerts a force F_AB on body B, then body B exerts an instantaneous force F_BA on body A such that:
F_AB = -F_BA

Crucial Exam Distinction: Action and reaction forces act on two DIFFERENT bodies, never on the same body. Consequently, they can never cancel each other out or create equilibrium within a single isolated body.

---

## 4. Universal Gravitation and Orbital Dynamics

Newton demonstrated that the same force causing an apple to fall from a tree also maintains the Moon in its orbit around the Earth. The gravitational attraction between any two point masses is expressed as:

F_g = G · (M · m) / r²

Where:
- G is the Universal Gravitational Constant (6.674 × 10^-11 N·m²/kg²)
- M and m are the interacting masses
- r is the separation distance measured between their centers of mass

### Satellite Motion & Orbital Velocity
For a satellite in circular orbit around Earth, gravitational attraction provides the necessary centripetal force:
m · v² / r = G · M · m / r²

Canceling satellite mass m yields:
v = sqrt(G · M / r)

Orbital velocity of a satellite near Earth surface is v = sqrt(GM / r) ≈ 7.9 km/s.
Notice that orbital velocity depends solely on the central mass M and the orbit radius r, completely independent of the satellite's own mass.`
  },
  {
    id: 'doc-biology-2',
    title: 'Cellular Architecture, Organelles & Energy Transfer',
    subject: 'Biology',
    readTime: '7 min read',
    coverImage: '/src/assets/images/biology_cell_study_1795184016837.jpg',
    tags: ['Cytology', 'Mitochondria', 'Cell Biology', 'Bioenergetics'],
    updatedAt: '2026-11-20',
    highlights: [
      {
        id: 'hl-bio-1',
        documentId: 'doc-biology-2',
        text: 'The plasma membrane is a selectively permeable phospholipid bilayer with embedded integral and peripheral proteins (Fluid Mosaic Model).',
        category: 'core',
        noteText: 'Proposed by Singer and Nicolson in 1972. Hydrophobic tails point inward, hydrophilic heads face aqueous sides.',
        createdAt: '2026-11-20T06:05:00.000Z'
      },
      {
        id: 'hl-bio-2',
        documentId: 'doc-biology-2',
        text: 'Mitochondria are the powerhouses of the cell, generating Adenosine Triphosphate (ATP) via oxidative phosphorylation and the Krebs cycle.',
        category: 'core',
        noteText: 'Contain their own circular DNA (mtDNA) and 70S ribosomes (Endosymbiotic Theory).',
        createdAt: '2026-11-20T06:06:00.000Z'
      },
      {
        id: 'hl-bio-3',
        documentId: 'doc-biology-2',
        text: 'Aerobic cellular respiration yields approximately 36 to 38 ATP molecules per molecule of oxidized glucose.',
        category: 'formula',
        noteText: 'C6H12O6 + 6O2 -> 6CO2 + 6H2O + 36-38 ATP.',
        createdAt: '2026-11-20T06:07:00.000Z'
      },
      {
        id: 'hl-bio-4',
        documentId: 'doc-biology-2',
        text: 'Plant cells possess a rigid cellulose cell wall, chloroplasts, and a large central vacuole, which are absent in animal cells.',
        category: 'exam',
        noteText: 'Classic 5-mark comparison question in board and university examinations.',
        createdAt: '2026-11-20T06:08:00.000Z'
      }
    ],
    content: `## 1. The Eukaryotic Cell: Structural Organization

Cells are the structural and functional units of all living organisms. Eukaryotic cells are distinguished by possessing a membrane-bound nucleus and compartmentalized membrane-bound organelles that partition metabolic reactions.

The plasma membrane is a selectively permeable phospholipid bilayer with embedded integral and peripheral proteins (Fluid Mosaic Model). The hydrophobic fatty acid tails face each other, creating an effective barrier to polar solutes and macromolecules.

---

## 2. Nucleus: The Genetic Control Center

The nucleus stores chromatin (DNA wound around histone proteins) and controls gene expression. It is enclosed by a double-membrane nuclear envelope perforated with nuclear pore complexes regulating nucleocytoplasmic transport.

The nucleolus is the dense subnuclear structure responsible for synthesizing ribosomal RNA (rRNA) and assembling ribosomal subunits.

---

## 3. Bioenergetics: Mitochondria and Cellular Respiration

Mitochondria are the powerhouses of the cell, generating Adenosine Triphosphate (ATP) via oxidative phosphorylation and the Krebs cycle.

Key structural features of mitochondria include:
- Smooth outer membrane
- Highly folded inner membrane forming **cristae** to maximize surface area for the electron transport chain (ETC)
- Mitochondrial matrix housing pyruvate dehydrogenase and Krebs cycle enzymes
- Maternal inheritance and circular mtDNA

### Overall Equation of Aerobic Respiration:
Aerobic cellular respiration yields approximately 36 to 38 ATP molecules per molecule of oxidized glucose.
Equation: C₆H₁₂O₆ + 6O₂ ➔ 6CO₂ + 6H₂O + 36-38 ATP

---

## 4. Endomembrane System and Protein Packaging

1. **Rough Endoplasmic Reticulum (RER)**: Studded with ribosomes; synthesizes and folds transmembrane and secretory proteins.
2. **Smooth Endoplasmic Reticulum (SER)**: Synthesizes lipids, metabolizes carbohydrates, and detoxifies drugs/xenobiotics.
3. **Golgi Apparatus**: Modifies (glycosylation), sorts, and packages proteins received from the RER into vesicles destined for lysosomes, the plasma membrane, or exocytosis.

### High-Yield Exam Comparison
Plant cells possess a rigid cellulose cell wall, chloroplasts, and a large central vacuole, which are absent in animal cells.`
  },
  {
    id: 'doc-cs-3',
    title: 'Data Structures & Algorithms: Trees, Graphs & Complexity',
    subject: 'Computer Science',
    readTime: '9 min read',
    coverImage: '/src/assets/images/cs_algorithms_study_1795184016436.jpg',
    tags: ['Algorithms', 'Trees', 'Graphs', 'Big-O'],
    updatedAt: '2026-11-20',
    highlights: [
      {
        id: 'hl-cs-1',
        documentId: 'doc-cs-3',
        text: 'A Binary Search Tree (BST) maintains the invariant: for any node N, all values in its left subtree are < N.val, and all values in its right subtree are > N.val.',
        category: 'core',
        noteText: 'In-order traversal of a valid BST always yields sorted ascending order.',
        createdAt: '2026-11-20T06:09:00.000Z'
      },
      {
        id: 'hl-cs-2',
        documentId: 'doc-cs-3',
        text: 'Search, insertion, and deletion in a balanced BST take O(log n) time, but degrade to O(n) in a degenerate skewed tree.',
        category: 'exam',
        noteText: 'Examiner favorite: Skewed tree behaves like a linked list. Balanced trees (AVL, Red-Black) solve this.',
        createdAt: '2026-11-20T06:10:00.000Z'
      },
      {
        id: 'hl-cs-3',
        documentId: 'doc-cs-3',
        text: 'Breadth-First Search (BFS) uses a Queue and discovers the shortest path on unweighted graphs in O(V + E) time.',
        category: 'formula',
        noteText: 'BFS = Queue (FIFO), DFS = Stack (LIFO or recursion). V = vertices, E = edges.',
        createdAt: '2026-11-20T06:11:00.000Z'
      }
    ],
    content: `## 1. Algorithmic Complexity and Asymptotic Analysis

Algorithm analysis evaluates computational time and memory resources required by an algorithm as the input size n approaches infinity.

- **Big-O Notation [O(n)]**: Upper bound / worst-case performance guarantee.
- **Omega Notation [Ω(n)]**: Lower bound / best-case scenario.
- **Theta Notation [Θ(n)]**: Tight asymptotic bound.

---

## 2. Binary Search Trees (BST)

A Binary Search Tree (BST) maintains the invariant: for any node N, all values in its left subtree are < N.val, and all values in its right subtree are > N.val.

### Operations and Time Complexities:
- Search: O(h) where h is the tree height.
- Insertion: O(h)
- Deletion: O(h)

Search, insertion, and deletion in a balanced BST take O(log n) time, but degrade to O(n) in a degenerate skewed tree.

Self-balancing binary trees such as AVL Trees and Red-Black Trees dynamically perform tree rotations to ensure h = O(log n) at all times.

---

## 3. Graph Representations: Adjacency Matrix vs Adjacency List

A graph G = (V, E) consists of a set of vertices V and edges E.

1. **Adjacency Matrix**:
   - 2D boolean array of size V × V.
   - Space complexity: O(V²).
   - Edge lookup time: O(1).
   - Best suited for dense graphs where |E| ≈ |V|².

2. **Adjacency List**:
   - Array or hash table of linked lists/arrays storing neighbors for each vertex.
   - Space complexity: O(V + E).
   - Iterating neighbors takes O(deg(u)).
   - Optimal for sparse graphs.

---

## 4. Fundamental Graph Traversals

### Breadth-First Search (BFS)
Breadth-First Search (BFS) uses a Queue and discovers the shortest path on unweighted graphs in O(V + E) time. Level-order exploration makes BFS essential for shortest path routing and bipartite graph testing.

### Depth-First Search (DFS)
DFS plunges deep down a branch before backtracking using a Stack or recursion. It is the primary engine for topological sorting in Directed Acyclic Graphs (DAGs) and detecting cycles.`
  }
];

export const INITIAL_NOTES: ExamNote[] = [
  {
    id: 'note-1',
    documentId: 'doc-physics-1',
    title: 'Newtonian Mechanics & Universal Gravitation Revision Sheet',
    subject: 'Physics',
    cues: [
      "What is Inertia?",
      "Why F = dp/dt?",
      "Why action-reaction never cancels?",
      "Orbital velocity formula",
      "Common exam numerical pitfall"
    ],
    notes: `### Core Laws & Principles
- **Newton 1st Law**: Objects resist change in velocity. Inertia ∝ mass.
- **Newton 2nd Law**: $\\Sigma F = m \\cdot a$. (More fundamentally, $F = \\frac{dp}{dt}$).
- **Newton 3rd Law**: Equal and opposite forces. Act on TWO SEPARATE bodies.

### Gravitation & Orbits
- Law of Gravitation: $F_g = G \\frac{M m}{r^2}$
- Orbital Speed: $v = \\sqrt{\\frac{GM}{r}}$ (Independent of satellite mass!).
- Escape Velocity: $v_{esc} = \\sqrt{\\frac{2GM}{r}} = \\sqrt{2} \\cdot v_{orbit} \\approx 11.2 \\text{ km/s}$ on Earth.

### Exam Pitfalls to Avoid:
1. Forgetting to convert km to meters in gravitational calculations!
2. Adding action and reaction forces on the same free-body diagram.`,
    summary: 'Mass is the measure of inertia. F = ma governs acceleration. Action-reaction pairs act on different objects. Orbital velocity v = sqrt(GM/r) depends only on the central planet mass and orbital radius.',
    tags: ['High Yield', 'Formulas', 'Exam Guaranteed'],
    updatedAt: '2026-11-20'
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    documentId: 'doc-physics-1',
    front: "What is the physical quantity that directly measures an object's inertia?",
    back: 'Mass (Inertial mass). The greater the mass, the greater the resistance to change in velocity.',
    category: 'Definition',
    status: 'mastered',
    reviewCount: 3
  },
  {
    id: 'fc-2',
    documentId: 'doc-physics-1',
    front: 'Why do Newton’s third law action-reaction pairs never cancel each other out?',
    back: 'Because they act on two DIFFERENT objects, not on the same object. Equilibrium requires opposing forces on the SAME body.',
    category: 'Exam Trap',
    status: 'learning',
    reviewCount: 2
  },
  {
    id: 'fc-3',
    documentId: 'doc-physics-1',
    front: 'What is the formula for the orbital speed of a satellite around a planet of mass M?',
    back: 'v = sqrt(G · M / r). Notice that satellite mass (m) is NOT present in the formula.',
    category: 'Formula',
    status: 'new',
    reviewCount: 0
  },
  {
    id: 'fc-4',
    documentId: 'doc-biology-2',
    front: 'Which organelle is responsible for ATP synthesis, and why does it have cristae?',
    back: 'Mitochondria. Cristae are inner membrane folds that dramatically increase surface area for electron transport chains and ATP synthase.',
    category: 'Cell Biology',
    status: 'learning',
    reviewCount: 1
  },
  {
    id: 'fc-5',
    documentId: 'doc-cs-3',
    front: 'What is the worst-case time complexity of searching in an unbalanced/skewed BST?',
    back: 'O(n). A skewed BST degrades into a linear linked list. Balanced BSTs (AVL, Red-Black) maintain O(log n).',
    category: 'Complexity',
    status: 'mastered',
    reviewCount: 4
  }
];

export const INITIAL_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'doc-physics-1': [
    {
      id: 'q-p1',
      question: 'A satellite of mass 500 kg orbits Earth at radius R with speed v. If replaced by a 2000 kg satellite in the same orbit, what will be its speed?',
      options: ['v (The speed remains unchanged)', '2v (Speed doubles)', '4v (Speed quadruples)', 'v / 2 (Speed is halved)'],
      correctIndex: 0,
      explanation: 'Orbital velocity v = sqrt(GM/r) is completely independent of the satellite mass m. Both light and heavy satellites travel at the exact same orbital speed.',
      conceptTag: 'Orbital Mechanics',
      difficulty: 'High-Yield Exam'
    },
    {
      id: 'q-p2',
      question: 'Why do action-reaction forces according to Newton’s Third Law never produce equilibrium?',
      options: [
        'They act on two different bodies',
        'They are unequal in magnitude',
        'They act in perpendicular directions',
        'They only occur during non-inertial motion'
      ],
      correctIndex: 0,
      explanation: 'Equilibrium requires that the vector sum of forces acting on a SINGLE body equals zero. Action and reaction forces act on distinct bodies, so they cannot cancel each other.',
      conceptTag: 'Newton 3rd Law',
      difficulty: 'Medium'
    },
    {
      id: 'q-p3',
      question: 'If the distance between two masses is doubled, how does the gravitational attraction force change?',
      options: [
        'Decreases to 1/4 of its original value',
        'Decreases to 1/2 of its original value',
        'Remains constant',
        'Doubles'
      ],
      correctIndex: 0,
      explanation: 'By the inverse-square law F ∝ 1/r². When r is multiplied by 2, r² becomes 4, reducing force to F/4.',
      conceptTag: 'Universal Gravitation',
      difficulty: 'Easy'
    }
  ]
};

export const INITIAL_IMPORTANT_QUESTIONS: ImportantQuestion[] = [
  {
    id: 'iq-1',
    documentId: 'doc-physics-1',
    subject: 'Physics',
    chapterTitle: "Newton's Laws of Motion & Orbital Gravitation",
    question: 'State Newton’s Second Law in terms of momentum, and prove that F = ma when mass remains constant.',
    marks: 5,
    questionType: 'long',
    importance: 'very_high',
    frequency: 'Board Exam 2024, 2022, 2020 (Repeated 3x)',
    modelAnswer: `1. Statement: The time rate of change of linear momentum of an object is directly proportional to the applied resultant force and occurs in the direction of the force.
Mathematically: F ∝ dp/dt  =>  F = k · (dp/dt). In SI units, k = 1, so F = dp/dt.

2. Derivation:
Since linear momentum is p = m · v,
F = d(m · v) / dt

Applying product rule:
F = m · (dv/dt) + v · (dm/dt)

If the mass of the object remains constant during motion (dm/dt = 0):
F = m · (dv/dt)

Since acceleration a = dv/dt:
F = m · a  [Proved]

3. Key Exam Note: Always write the vector notation arrow above F and a, and state SI Unit: Newton (N = kg·m/s²).`,
    keyPoints: [
      'Define momentum p = mv',
      'Show product rule expansion',
      'Apply condition dm/dt = 0',
      'Specify SI units (Newton)'
    ],
    status: 'writing_practiced',
    createdAt: '2026-11-20T06:00:00.000Z'
  },
  {
    id: 'iq-2',
    documentId: 'doc-physics-1',
    subject: 'Physics',
    chapterTitle: "Newton's Laws of Motion & Orbital Gravitation",
    question: 'Why do Action and Reaction forces never cancel each other out to produce equilibrium?',
    marks: 3,
    questionType: 'conceptual',
    importance: 'very_high',
    frequency: 'Past Paper 2023, 2021 (Frequent Short Question)',
    modelAnswer: `Action and Reaction forces cannot produce equilibrium because:
1. They act simultaneously on TWO SEPARATE and distinct bodies, never on the same body.
2. For equilibrium to occur, the vector sum of forces acting upon the SAME isolated body must be zero (ΣF_same_body = 0).
3. Example: When walking, the foot exerts an action force backward on the earth; the earth exerts an equal reaction force forward on the foot. Because the forces act on two different systems (Earth vs Foot), they do not cancel.`,
    keyPoints: [
      'Forces act on distinct bodies',
      'Equilibrium requires ΣF = 0 on same body',
      'Give concrete walking or rocket propulsion example'
    ],
    status: 'to_practice',
    createdAt: '2026-11-20T06:05:00.000Z'
  },
  {
    id: 'iq-3',
    documentId: 'doc-biology-2',
    subject: 'Biology',
    chapterTitle: 'Cellular Architecture, Organelles & Energy Transfer',
    question: 'Describe the Fluid Mosaic Model of the plasma membrane with a neat labeled diagram explanation.',
    marks: 5,
    questionType: 'long',
    importance: 'very_high',
    frequency: 'Board Exam 2024, 2019',
    modelAnswer: `1. Proposed By: S.J. Singer and G.L. Nicolson in 1972.
2. Structural Organization:
- Phospholipid Bilayer: Polar hydrophilic phosphate heads face the external and internal aqueous environments; non-polar hydrophobic fatty acid tails face inward, preventing polar macromolecules from crossing freely.
- Proteins ("Mosaic"):
  a) Integral (Intrinsic) Proteins: Firmly embedded or spanning across the bilayer (transmembrane channels, pumps, receptors).
  b) Peripheral (Extrinsic) Proteins: Loosely bound to the outer or inner surface.
- Cholesterol: Regulates membrane fluidity at varying temperatures.
- Glycoproteins & Glycolipids: Function in cell-cell recognition and adhesion.`,
    keyPoints: [
      'Singer & Nicolson (1972)',
      'Bilayer: Hydrophilic heads vs Hydrophobic tails',
      'Integral vs Peripheral proteins',
      'Cholesterol fluidity role'
    ],
    status: 'to_practice',
    createdAt: '2026-11-20T06:10:00.000Z'
  },
  {
    id: 'iq-4',
    documentId: 'doc-cs-3',
    subject: 'Computer Science',
    chapterTitle: 'Data Structures & Algorithms: Trees, Graphs & Complexity',
    question: 'Explain why search operation in an unbalanced Binary Search Tree degrades to O(n) and how balanced trees solve this.',
    marks: 4,
    questionType: 'conceptual',
    importance: 'high',
    frequency: 'University Exams & Technical Interviews',
    modelAnswer: `1. Degradation Cause:
In a Binary Search Tree (BST), search complexity is proportional to the tree height h: O(h). If nodes are inserted in sorted order (e.g. 10 -> 20 -> 30 -> 40), the tree becomes degenerate (skewed). Each node has only one child, transforming the tree structurally into a linear Linked List where height h = n. Searching for the leaf element requires inspecting all n nodes, degrading time to O(n).

2. Solution via Self-Balancing Trees:
Balanced trees (e.g., AVL Trees, Red-Black Trees) enforce balance invariants using tree rotations upon insertion/deletion, guaranteeing height h = O(log n) at all times.`,
    keyPoints: [
      'Height h governs search time O(h)',
      'Sorted insertion creates single-branched skewed tree (linked list)',
      'Height becomes n => O(n) worst-case',
      'AVL/Red-Black maintain h = O(log n) via rotations'
    ],
    status: 'mastered',
    createdAt: '2026-11-20T06:15:00.000Z'
  }
];

export const INITIAL_CONCEPT_VAULT: ConceptVaultItem[] = [
  {
    id: 'cv-1',
    documentId: 'doc-physics-1',
    subject: 'Physics',
    chapterTitle: "Newton's Laws of Motion & Orbital Gravitation",
    concept: "Action vs Reaction Pairs (Newton's 3rd Law)",
    easyExplanation: 'Har action ka equal aur opposite reaction hota hai, LEKIN dono forces do alag alag cheezon par lagti hain!',
    analogy: 'Jab aap deewar ko hath se dhakka dete hain, deewar aapke hath ko dhakka deti hai. Hath deewar par laga raha hai, deewar hath par. Dono forces ek hi jagah nahi hain.',
    whyConfusing: 'Students aksar sochte hain ke agar dono forces barabar aur mukhalif (opposite) hain, to unhein cancel out ho jana chahiye aur koi cheez chalni hi nahi chahiye!',
    keyRulesOrFormula: 'F_AB = - F_BA. Hamesha 2 different bodies par act karengi. Equilibrium kabi nahi banayengi.',
    myOwnNotes: 'Paper mein hamesha highlight karna hai ke "Acts on different bodies". FBD banate waqt sirf us body par lagne wali forces dikhani hain.',
    clarityLevel: 'crystal_clear',
    createdAt: '2026-11-20T06:00:00.000Z',
    updatedAt: '2026-11-20T06:00:00.000Z'
  },
  {
    id: 'cv-2',
    documentId: 'doc-physics-1',
    subject: 'Physics',
    chapterTitle: "Newton's Laws of Motion & Orbital Gravitation",
    concept: 'Orbital Speed Independence of Satellite Mass',
    easyExplanation: 'Satellite chahe 10 kg ka ho ya 10,000 kg ka, agar wo zameen se ek hi faasle (radius r) par ghoom raha hai to dono ki raftaar bilkul barabar hogi!',
    analogy: 'Jaise hawa ke baghair bhari pathar aur halka kaghaz ek hi raftaar se girtay hain (Galileo experiment), waise hi space mein orbit gravitation mein mass cancel ho jata hai.',
    whyConfusing: 'Bache sochte hain bhari satellite ko tezi se chalna padega ya gir jayega, jabke equation mein m cancel ho jata hai.',
    keyRulesOrFormula: 'v = sqrt(G · M / r). Yahan M sirf markaz (central planet) ka mass hai.',
    myOwnNotes: 'Examiner aksar trick question deta hai: "Satellite mass is doubled, what happens to speed?" Answer: Remains constant (v).',
    clarityLevel: 'crystal_clear',
    createdAt: '2026-11-20T06:05:00.000Z',
    updatedAt: '2026-11-20T06:05:00.000Z'
  },
  {
    id: 'cv-3',
    documentId: 'doc-biology-2',
    subject: 'Biology',
    chapterTitle: 'Cellular Architecture, Organelles & Energy Transfer',
    concept: 'Mitochondrial Cristae & Electron Transport Chain (ETC)',
    easyExplanation: 'Mitochondria ki andar wali jilli (inner membrane) seedhi hone ke bajaye chunnat-dar (folded) hoti hai taake ATP banane wali machines zyada se zyada lag sakein.',
    analogy: 'Jaise radiator mein folds hote hain taake garmi zyada nikal sake, waise hi cristae surface area barhati hain taake zyada ATP energy ban sake.',
    whyConfusing: 'Students aksar matrix aur cristae mein confuse hote hain, ya samajhte hain ke ATP outer membrane par banta hai.',
    keyRulesOrFormula: 'Surface Area increase = Higher ATP Synthase enzyme density = 36-38 ATP per glucose.',
    myOwnNotes: 'Diagram mein cristae ke folds wazeh banayein aur ATP Synthase particles show karein.',
    clarityLevel: 'getting_there',
    createdAt: '2026-11-20T06:10:00.000Z',
    updatedAt: '2026-11-20T06:10:00.000Z'
  },
  {
    id: 'cv-4',
    documentId: 'doc-cs-3',
    subject: 'Computer Science',
    chapterTitle: 'Data Structures & Algorithms: Trees, Graphs & Complexity',
    concept: 'Big-O (Worst Case) vs Theta (Tight Bound)',
    easyExplanation: 'Big-O ceiling (chhat) batata hai ke is se bura waqt nahi lag sakta. Theta asal exact raftaar batata hai.',
    analogy: 'Agar koi kahe "Yeh safar zyada se zyada 2 ghante lega" to yeh O(2h) hai. Agar wo kahe "Yeh safar theek 1.5 ghante lega chahe kuch bhi ho", to yeh Theta(1.5h) hai.',
    whyConfusing: 'Daily coding mein log Big-O bolte hain jabke wo aksar Theta mean kar rahe hote hain.',
    keyRulesOrFormula: 'O(g(n)) = Upper bound | Ω(g(n)) = Lower bound | Θ(g(n)) = Both upper and lower bound match.',
    myOwnNotes: 'Exam mein definition likhte waqt c1·g(n) <= f(n) <= c2·g(n) wali inequality zaroor likhni hai.',
    clarityLevel: 'confused',
    createdAt: '2026-11-20T06:15:00.000Z',
    updatedAt: '2026-11-20T06:15:00.000Z'
  }
];


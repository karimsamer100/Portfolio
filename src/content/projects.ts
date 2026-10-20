export type ProjectId = 'drrepo' | 'sirengrid' | 'distributed' | 'support-rag' | 'mnist';

export interface Project {
  id: ProjectId;
  /** Index row. */
  name: string;
  summary: string;
  meta: string;
  figure: string;
  figureLabel: string;
  /** Chapter copy. */
  title: string;
  description: string;
  /** Chapter stage colour. */
  tone: 'ink' | 'paper';
  facts: { label: string; text: string; todo?: boolean }[];
  repo: string;
}

const ROLE_TODO = { label: "Karim's role", text: 'To confirm with Karim before launch.', todo: true };

export const projects: Project[] = [
  {
    id: 'drrepo',
    name: 'DrRepo',
    summary: 'Audits a Python repository and turns the evidence into a fix plan in priority order',
    meta: 'Solo product · FastAPI · React · Jun – Jul 2026',
    figure: '7',
    figureLabel: 'evidence sources, one fix plan',
    title: 'A second opinion for any Python repository.',
    description:
      'An evidence-driven audit platform. It collects static-analysis, test and coverage evidence, keeps the observed score separate from how confident that evidence is, and returns a fix plan in priority order. AI is optional and may only explain what was verified.',
    tone: 'ink',
    facts: [
      { label: 'Built with', text: 'Python, FastAPI, Typer CLI, React and TypeScript, Docker for isolated runs. Ruff, Bandit, Radon, pytest and coverage.py as evidence sources.' },
      { label: 'What it does', text: 'Three audit modes, calibrated scoring with evidence confidence, project intelligence, release readiness, a static architecture map with risk hotspots, and a grounded AI advisor with a deterministic fallback.' },
      { label: 'Interfaces', text: 'Web app, CLI and REST API, all from one audit engine, with JSON, Markdown and terminal reports.' },
      { label: "Karim's role", text: 'Solo project: product design, backend, frontend and test suite.' },
    ],
    repo: 'https://github.com/karimsamer100/DrRepo',
  },
  {
    id: 'sirengrid',
    name: 'SirenGrid',
    summary: "Emergency-response coordination for Cairo, from a citizen's report to a hospital pre-alert",
    meta: 'Code Titans · IMPACT ECU 2026 hackathon · Sep 2026',
    figure: '416',
    figureLabel: 'population zones in the coverage model',
    title: 'From one tap to a coordinated response.',
    description:
      'A two-sided emergency-response platform built by team Code Titans for IMPACT ECU 2026: a Flutter citizen app, an institutional command centre, and one FastAPI backend that plans, routes and replans every response, with humans approving critical actions.',
    tone: 'paper',
    facts: [
      { label: 'Built with', text: 'FastAPI, SQLite, WebSockets, a React command centre and a Flutter citizen app, on OpenStreetMap roads and WorldPop population data for Nasr City.' },
      { label: 'What it does', text: 'Voice or text intake, traffic-aware routing, coverage-aware dispatch, hospital selection and pre-alert, and replanning when roads, resources or hospitals change.' },
      { label: 'Evidence', text: 'A 36-scenario benchmark against greedy dispatch and 10 end-to-end acceptance scenarios. All integrations with real agencies are simulated.' },
      { label: "Karim's role", text: 'The backend decision engine: planning, routing, coverage, replanning and the benchmark.' },
    ],
    repo: 'https://github.com/MahmoudNagiubX/SirenGrid',
  },
  {
    id: 'distributed',
    name: 'Distributed RAG',
    summary: 'A scheduler routing LLM requests across three machines',
    meta: 'Distributed systems · Jul 2026',
    figure: '−25%',
    figureLabel: 'latency vs Round Robin',
    title: '1,000 requests. Three machines. None lost.',
    description:
      'A distributed RAG system built by a team of three. A master scheduler routes LLM questions across worker machines, and each worker runs its own retrieval pipeline and local model.',
    tone: 'ink',
    facts: [
      { label: 'Built with', text: 'Python, FastAPI, ChromaDB, all-MiniLM embeddings, Ollama running qwen2.5:1.5b on each worker, ngrok between machines.' },
      { label: 'What it does', text: 'Thread-safe task queue, three routing strategies, heartbeat health checks, and failed tasks re-queued up to three times.' },
      { label: 'Evidence', text: 'Benchmarks at 50, 100, 500 and 1,000 concurrent requests, reported in the project README and report.' },
      ROLE_TODO,
    ],
    repo: 'https://github.com/karimsamer100/Distributed-Rag-Project',
  },
  {
    id: 'support-rag',
    name: 'Customer Support RAG',
    summary: 'Retrieval-grounded answers, deployed with Docker on Railway',
    meta: 'DEPI project · May 2026',
    figure: '123k',
    figureLabel: 'support pairs indexed',
    title: 'Answers grounded in 123,000 real support cases.',
    description:
      'A customer-support assistant that finds similar past cases before an LLM writes the reply. FAISS search over MiniLM embeddings, served by FastAPI with API-key auth, metrics and feedback logging, and deployed with Docker on Railway.',
    tone: 'ink',
    facts: [
      { label: 'Built with', text: 'Python, sentence-transformers all-MiniLM-L6-v2, FAISS, FastAPI, Docker, Railway, optional MLflow tracking.' },
      { label: 'Data', text: 'About 123,000 AmazonHelp support pairs, cleaned and categorised. The public demo uses a 20,000-row index.' },
      { label: 'Evidence', text: 'Health, metrics and dashboard endpoints, an evaluation script, and docs for deployment, security and retraining.' },
      ROLE_TODO,
    ],
    repo: 'https://github.com/karimsamer100/Customer-Support-RAG-Powered-Intelligent-Chatbot',
  },
  {
    id: 'mnist',
    name: 'MNIST from scratch',
    summary: 'Five classifiers written in pure NumPy',
    meta: 'Machine learning · May 2026',
    figure: '89.21%',
    figureLabel: '10-class test accuracy',
    title: 'Ten digits. No ML libraries. Just NumPy.',
    description:
      'Handwritten digit classification. KNN, softmax regression, Gaussian Naive Bayes, Nearest Centroid and PCA, each implemented by hand and evaluated on MNIST.',
    tone: 'paper',
    facts: [
      { label: 'Built with', text: 'Python and NumPy only for the models; pandas and Matplotlib for data and figures. Packaged with Docker.' },
      { label: 'What it does', text: 'Binary and ten-class pipelines, cross-validation, regularisation analysis and learning curves.' },
      ROLE_TODO,
    ],
    repo: 'https://github.com/karimsamer100/MNIST-Classification-ML-Project',
  },
];

/** Smaller projects listed under the chapters, without their own chapter. */
export const alsoBuilt: { name: string; label: string; text: string; repo: string }[] = [
  {
    name: 'PID Motor Control',
    label: 'Control systems · Arduino',
    text: 'Closed-loop position control of a geared DC motor. Settles a 360° move in about 1.5 s with zero steady-state error.',
    repo: 'https://github.com/karimsamer100/Motor-Position-Control',
  },
  {
    name: 'Smart Door Lock',
    label: 'Embedded · TM4C123',
    text: 'Two microcontrollers split the keypad interface from the security logic and talk over UART. MISRA C.',
    repo: 'https://github.com/karimsamer100/Smart-Door-Lock-System-Embedded-Project',
  },
  {
    name: 'Car Price Prediction',
    label: 'Big data analytics · R',
    text: 'The full analytics lifecycle on 19,237 listings, from cleaning and hypothesis tests to regression models.',
    repo: 'https://github.com/karimsamer100/Car-Price-Prediction-Using-Big-Data-Analytics-R-',
  },
];

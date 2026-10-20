export type ProjectId = 'distributed' | 'support-rag' | 'mnist';

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
    id: 'distributed',
    name: 'Distributed RAG',
    summary: 'A scheduler routing LLM requests across three machines',
    meta: 'CSE354 group project · Jul 2026',
    figure: '−25%',
    figureLabel: 'latency vs Round Robin',
    title: '1,000 requests. Three machines. None lost.',
    description:
      'A distributed RAG system built as a three-person group project for CSE354, 2026. A master scheduler routes LLM questions across worker machines, and each worker runs its own retrieval pipeline and local model.',
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
    meta: 'CSE382 · May 2026',
    figure: '89.21%',
    figureLabel: '10-class test accuracy',
    title: 'Ten digits. No ML libraries. Just NumPy.',
    description:
      'Handwritten digit classification for CSE382, 2026. KNN, softmax regression, Gaussian Naive Bayes, Nearest Centroid and PCA, each implemented by hand and evaluated on MNIST.',
    tone: 'paper',
    facts: [
      { label: 'Built with', text: 'Python and NumPy only for the models; pandas and Matplotlib for data and figures. Packaged with Docker.' },
      { label: 'What it does', text: 'Binary and ten-class pipelines, cross-validation, regularisation analysis and learning curves.' },
      { label: 'Try it', text: 'Optional: a small "draw a digit" demo running the hand-written model in the browser could live here.' },
      ROLE_TODO,
    ],
    repo: 'https://github.com/karimsamer100/MNIST-Classification-ML-Project',
  },
];

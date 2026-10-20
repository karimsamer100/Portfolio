import { imageAt } from './images';

export interface Credential {
  /** File name (without extension) of the scan in src/assets/photos/certificates/. */
  key: string;
  title: string;
  issuer: string;
  /** Issue date when verified; omitted otherwise. */
  date?: string;
  group: 'AI & machine learning' | 'Data & cloud' | 'Automation' | 'Language';
  /** Short issuer monogram shown on the shelf. */
  mark: string;
  /** Filled from the scan file when present; until then a typeset card is shown. */
  image?: string;
}

const list: Omit<Credential, 'image'>[] = [
  { key: 'ml-specialization', title: 'Machine Learning Specialization', issuer: 'DeepLearning.AI', group: 'AI & machine learning', mark: 'DL' },
  { key: 'ibm-deep-learning', title: 'Intro to Deep Learning & Neural Networks', issuer: 'IBM · Coursera', group: 'AI & machine learning', mark: 'IBM' },
  { key: 'sas-trustworthy-ai', title: 'Responsible Innovation & Trustworthy AI', issuer: 'SAS', date: 'Sep 2025', group: 'AI & machine learning', mark: 'SAS' },
  { key: 'microsoft-ml-engineer', title: 'Machine Learning Engineer track', issuer: 'Microsoft · DEPI', date: '2026', group: 'AI & machine learning', mark: 'MS' },
  { key: 'huawei-hcia-big-data', title: 'HCIA-Big Data', issuer: 'Huawei', date: 'Nov 2024', group: 'Data & cloud', mark: 'HW' },
  { key: 'aws-cloud-foundations', title: 'Cloud Foundations', issuer: 'AWS Academy', group: 'Data & cloud', mark: 'AWS' },
  { key: 'uipath-automation', title: 'Automation Developer Associate Training', issuer: 'UiPath', date: 'Aug 2025', group: 'Automation', mark: 'UI' },
  { key: 'ielts', title: 'IELTS 7.5', issuer: 'C1 English', group: 'Language', mark: 'EN' },
];

export const credentials: Credential[] = list.map((c) => ({ ...c, image: imageAt('certificates', c.key) }));

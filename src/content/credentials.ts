export interface Credential {
  title: string;
  issuer: string;
  /** Issue date when verified; omitted otherwise. */
  date?: string;
  group: 'AI & machine learning' | 'Data & cloud' | 'Automation' | 'Language';
  /** Short issuer monogram shown on the shelf. */
  mark: string;
  /** Certificate image URL once Karim supplies the scan; until then a typeset card is shown. */
  image?: string;
}

export const credentials: Credential[] = [
  { title: 'Machine Learning Specialization', issuer: 'DeepLearning.AI', group: 'AI & machine learning', mark: 'DL' },
  { title: 'Intro to Deep Learning & Neural Networks', issuer: 'IBM · Coursera', group: 'AI & machine learning', mark: 'IBM' },
  { title: 'Responsible Innovation & Trustworthy AI', issuer: 'SAS', date: 'Sep 2025', group: 'AI & machine learning', mark: 'SAS' },
  { title: 'Machine Learning Engineer track', issuer: 'Microsoft · DEPI', date: '2026', group: 'AI & machine learning', mark: 'MS' },
  { title: 'HCIA-Big Data', issuer: 'Huawei', date: 'Nov 2024', group: 'Data & cloud', mark: 'HW' },
  { title: 'Cloud Foundations', issuer: 'AWS Academy', group: 'Data & cloud', mark: 'AWS' },
  { title: 'Automation Developer Associate Training', issuer: 'UiPath', date: 'Aug 2025', group: 'Automation', mark: 'UI' },
  { title: 'IELTS 7.5', issuer: 'C1 English', group: 'Language', mark: 'EN' },
];

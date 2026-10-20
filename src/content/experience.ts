export interface ExperienceStop {
  /** Year marker drawn on the line before this stop (only on the first stop of a year). */
  year?: string;
  org: string;
  role: string;
  when: string;
  /** Short name used for the oversized background type. */
  short: string;
  /** Optional background photo URL. */
  photo?: string;
}

export const experience: ExperienceStop[] = [
  { year: '2023', org: 'Ain Shams University', role: 'B.Sc. Computer & AI Engineering, dual degree with UEL', when: 'Sep 2023 – present', short: 'Ain Shams' },
  { year: '2025', org: 'Huawei × NTI', role: 'Big Data training: Hadoop ecosystem, Huawei MRS', when: '2025', short: 'Huawei' },
  { org: 'CIB Egypt', role: 'The Green Leap Summer Program', when: '2025', short: 'CIB' },
  { org: 'GSS', role: 'Digital Transformation Engineering Intern · UiPath & RPA', when: 'Aug – Oct 2025', short: 'GSS' },
  { year: '2026', org: 'DEPI', role: 'Microsoft Machine Learning Engineer track', when: '2026', short: 'DEPI' },
  { org: 'Konecta', role: 'Generative AI Intern · LLM apps, RAG, agents', when: 'Jul – Sep 2026', short: 'Konecta' },
  { org: 'Dell Technologies', role: 'Summer Technology Internship · technical sales', when: 'Aug 2026', short: 'Dell' },
  { org: 'Cisco Egypt', role: 'Summer Program · networking & data center', when: 'Aug 2026', short: 'Cisco' },
];

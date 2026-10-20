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
  /**
   * Small cards that fan out beside the stop. `src: null` is a slot waiting for Karim's file:
   * it renders as a placeholder in dev / ?preview only, and is skipped on the live site.
   */
  images?: { src: string | null; kind: 'photo' | 'certificate'; alt: string }[];
}

const slots = (org: string, kinds: string) =>
  [...kinds].map((k, i) =>
    k === 'c'
      ? { src: null, kind: 'certificate' as const, alt: `${org} certificate` }
      : { src: null, kind: 'photo' as const, alt: `${org}, photo ${i + 1}` },
  );

export const experience: ExperienceStop[] = [
  { year: '2023', org: 'Ain Shams University', role: 'B.Sc. Computer & AI Engineering, dual degree with UEL', when: 'Sep 2023 – present', short: 'Ain Shams' },
  { year: '2025', org: 'Huawei × NTI', role: 'Big Data training: Hadoop ecosystem, Huawei MRS', when: '2025', short: 'Huawei', images: slots('Huawei × NTI', 'cpp') },
  { org: 'CIB Egypt', role: 'The Green Leap Summer Program', when: '2025', short: 'CIB', images: slots('CIB Egypt', 'pcp') },
  { org: 'GSS', role: 'Digital Transformation Engineering Intern · UiPath & RPA', when: 'Aug – Oct 2025', short: 'GSS', images: slots('GSS', 'cpp') },
  { year: '2026', org: 'DEPI', role: 'Microsoft Machine Learning Engineer track', when: '2026', short: 'DEPI', images: slots('DEPI', 'cp') },
  { org: 'Konecta', role: 'Generative AI Intern · LLM apps, RAG, agents', when: 'Jul – Sep 2026', short: 'Konecta', images: slots('Konecta', 'ppcp') },
  { org: 'Dell Technologies', role: 'Summer Technology Internship · technical sales', when: 'Aug 2026', short: 'Dell', images: slots('Dell Technologies', 'cpp') },
  { org: 'Cisco Egypt', role: 'Summer Program · networking & data center', when: 'Aug 2026', short: 'Cisco', images: slots('Cisco Egypt', 'cpp') },
];

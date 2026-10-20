import { imageAt, imagesIn } from './images';

export interface ExperienceStop {
  /** Folder name under src/assets/photos/experience/ for this stop's images. */
  key: string;
  /** Year marker drawn on the line before this stop (only on the first stop of a year). */
  year?: string;
  org: string;
  role: string;
  when: string;
  /** Short name used for the oversized background type. */
  short: string;
  /** Optional logo shown above the stop (a file named logo.* in the stop's folder). */
  logo?: string;
  /**
   * Small cards that fan out beside the stop. `src: null` is a slot waiting for Karim's file:
   * it renders as a placeholder in dev / ?preview only, and is skipped on the live site.
   */
  images?: { src: string | null; kind: 'photo' | 'certificate'; alt: string }[];
}

/**
 * Cards for a stop come from src/assets/photos/experience/<key>/. Files whose name starts with
 * "cert" get the certificate frame; "logo" is shown above the stop instead of as a card.
 * With no files yet, `kinds` describes placeholder cards (c = certificate, p = photo).
 */
const slots = (key: string, org: string, kinds: string) => {
  const found = imagesIn(`experience/${key}`).filter((f) => !f.base.startsWith('logo'));
  if (found.length)
    return found.map((f, i) =>
      f.base.startsWith('cert')
        ? { src: f.url, kind: 'certificate' as const, alt: `${org} certificate` }
        : { src: f.url, kind: 'photo' as const, alt: `${org}, photo ${i + 1}` },
    );
  return [...kinds].map((k, i) =>
    k === 'c'
      ? { src: null, kind: 'certificate' as const, alt: `${org} certificate` }
      : { src: null, kind: 'photo' as const, alt: `${org}, photo ${i + 1}` },
  );
};
const logo = (key: string) => imageAt(`experience/${key}`, 'logo');

export const experience: ExperienceStop[] = [
  { key: 'ain-shams', year: '2023', org: 'Ain Shams University', role: 'B.Sc. Computer & AI Engineering, dual degree with UEL', when: 'Sep 2023 – present', short: 'Ain Shams', logo: logo('ain-shams') },
  { key: 'huawei', year: '2025', org: 'Huawei × NTI', role: 'Big Data training: Hadoop ecosystem, Huawei MRS', when: '2025', short: 'Huawei', logo: logo('huawei'), images: slots('huawei', 'Huawei × NTI', 'cpp') },
  { key: 'cib', org: 'CIB Egypt', role: 'The Green Leap Summer Program', when: '2025', short: 'CIB', logo: logo('cib'), images: slots('cib', 'CIB Egypt', 'pcp') },
  { key: 'gss', org: 'GSS', role: 'Digital Transformation Engineering Intern · UiPath & RPA', when: 'Aug – Oct 2025', short: 'GSS', logo: logo('gss'), images: slots('gss', 'GSS', 'cpp') },
  { key: 'depi', year: '2026', org: 'DEPI', role: 'Microsoft Machine Learning Engineer track', when: '2026', short: 'DEPI', logo: logo('depi'), images: slots('depi', 'DEPI', 'cp') },
  { key: 'konecta', org: 'Konecta', role: 'Generative AI Intern · LLM apps, RAG, agents', when: 'Jul – Sep 2026', short: 'Konecta', logo: logo('konecta'), images: slots('konecta', 'Konecta', 'ppcp') },
  { key: 'dell', org: 'Dell Technologies', role: 'Summer Technology Internship · technical sales', when: 'Aug 2026', short: 'Dell', logo: logo('dell'), images: slots('dell', 'Dell Technologies', 'cpp') },
  { key: 'cisco', org: 'Cisco Egypt', role: 'Summer Program · networking & data center', when: 'Aug 2026', short: 'Cisco', logo: logo('cisco'), images: slots('cisco', 'Cisco Egypt', 'cpp') },
];

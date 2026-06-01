export interface EducationLink {
  label: string;
  href: string;
}

export interface EducationEntry {
  school: string;
  degree: string;
  gpa?: string;
  period?: string;
  links?: EducationLink[];
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  };
}

export const educationEntries: EducationEntry[] = [
  {
    school: "Telkom University",
    degree: "Bachelor's Degree in Computer Science",
    gpa: "3.88",
    logo: {
      src: "/telkom-university.png",
      alt: "Telkom University logo",
      width: 40,
      height: 48,
      className: "h-12 w-auto max-w-[48px] object-contain object-left",
    },
    links: [{ label: "Visit university", href: "https://telkomuniversity.ac.id/" }],
  },
];

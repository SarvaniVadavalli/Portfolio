export interface Section {
  id: string;
  label: string;
  title: string;
  inNav: boolean;
}

export const SECTIONS: Section[] = [
  { id: "hero", label: "Intro", title: "Intro", inNav: false },
  {
    id: "about",
    label: "About",
    title: "Building practical AI solutions through thoughtful engineering.",
    inNav: true,
  },
  {
    id: "skills",
    label: "Skillset",
    title: "Technologies I work with.",
    inNav: true,
  },
  { id: "journey", label: "Path", title: "My Journey.", inNav: true },
  {
    id: "projects",
    label: "Builds",
    title: "Featured Projects.",
    inNav: true,
  },
  {
    id: "certifications",
    label: "Certifications",
    title: "Credentials & Learning.",
    inNav: true,
  },
  {
    id: "talk",
    label: "Talk",
    title: "Let's Build Something Together.",
    inNav: true,
  },
];

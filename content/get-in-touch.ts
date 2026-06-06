export interface GetInTouchLink {
  id: string;
  label: string;
  href: string;
  display: string;
}

export interface GetInTouchGridTile {
  id: string;
  label: string;
  href: string;
  display: string;
  external?: boolean;
  featured?: boolean;
  subtitle?: string;
}

export const getInTouchLinks: GetInTouchLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/abui-am",
    display: "github.com/abui-am",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abuidillah-adjie-muliadi-bb0816190/",
    display: "linkedin.com/in/abuidillah-adjie-muliadi",
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:adjiem31@gmail.com",
    display: "adjiem31@gmail.com",
  },
];

export const getInTouchGridTiles: GetInTouchGridTile[] = [
  {
    id: "cal",
    label: "Book a call",
    href: "https://cal.com/abui-muliadi",
    display: "cal.com/abui-muliadi",
    external: true,
    featured: true,
    subtitle: "Free 30-minute intro call",
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:adjiem31@gmail.com",
    display: "adjiem31@gmail.com",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/abui-am",
    display: "github.com/abui-am",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abuidillah-adjie-muliadi-bb0816190/",
    display: "linkedin.com/in/abuidillah-adjie-muliadi",
    external: true,
  },
];

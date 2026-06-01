export interface PortfolioEmployer {
  id: string;
  href: string;
  src: string;
  label: string;
  width?: number;
  height?: number;
  imageClassName?: string;
}

export const portfolioEmployers: PortfolioEmployer[] = [
  {
    id: "evermos",
    href: "https://evermos.com/home/",
    src: "/evermos.svg",
    label: "Evermos",
    height: 48,
    width: 48,
    imageClassName: "size-12 object-contain",
  },
  {
    id: "dealls",
    href: "https://dealls.com/",
    src: "/dealls.svg",
    label: "Dealls",
    width: 109,
    height: 48,
    imageClassName: "h-12 w-auto max-w-[109px] object-contain",
  },
  {
    id: "binar",
    href: "https://www.binar.co.id/",
    src: "/binar.svg",
    label: "Binar Academy",
    height: 32,
    width: 80,
    imageClassName: "object-contain",
  },
  {
    id: "ekrut",
    href: "https://www.ekrut.com/",
    src: "/ekrut.svg",
    label: "Ekrut",
    imageClassName: "h-12 w-auto object-contain",
  },
];

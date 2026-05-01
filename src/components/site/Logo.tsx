interface LogoProps {
  className?: string;
  inverted?: boolean;
}

export const Logo = ({ className, inverted }: LogoProps) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="40" height="40" rx="10" fill={inverted ? "hsl(var(--accent))" : "hsl(var(--primary))"} />
    {/* Trama têxtil estilizada */}
    <path
      d="M10 14 L20 8 L30 14 L30 26 L20 32 L10 26 Z"
      stroke={inverted ? "hsl(var(--background))" : "hsl(var(--background))"}
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M10 14 L30 26 M30 14 L10 26 M20 8 L20 32" stroke={inverted ? "hsl(var(--background))" : "hsl(var(--background))"} strokeWidth="1.2" opacity="0.7" />
    <circle cx="20" cy="20" r="2.5" fill="hsl(var(--accent))" stroke={inverted ? "hsl(var(--primary))" : "hsl(var(--background))"} strokeWidth="1" />
  </svg>
);

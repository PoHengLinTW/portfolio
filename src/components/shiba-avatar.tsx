/**
 * Hand-drawn shiba face used as the site avatar. Pure SVG so it stays crisp at any size; the
 * backdrop follows the theme via the `monogram` color token, the dog's colors are fixed.
 */
export function ShibaAvatar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="32" className="fill-monogram" />

      {/* Ears */}
      <path d="M13 29 L16.5 8.5 Q17.2 6.8 18.8 7.9 L30 19 Z" fill="#D9822B" strokeLinejoin="round" />
      <path d="M51 29 L47.5 8.5 Q46.8 6.8 45.2 7.9 L34 19 Z" fill="#D9822B" strokeLinejoin="round" />
      <path d="M17.5 23 L18.8 12.5 L25.5 18.5 Z" fill="#F7D3B0" />
      <path d="M46.5 23 L45.2 12.5 L38.5 18.5 Z" fill="#F7D3B0" />

      {/* Head */}
      <ellipse cx="32" cy="36" rx="21" ry="18" fill="#E8973F" />

      {/* Cream cheeks and muzzle (the shiba "urajiro") */}
      <ellipse cx="19.5" cy="42" rx="7.5" ry="6.5" fill="#FFF4E2" />
      <ellipse cx="44.5" cy="42" rx="7.5" ry="6.5" fill="#FFF4E2" />
      <ellipse cx="32" cy="44" rx="13" ry="9.5" fill="#FFF4E2" />

      {/* Eyebrow dots */}
      <ellipse cx="24.5" cy="27.5" rx="2.3" ry="1.5" fill="#FFF4E2" />
      <ellipse cx="39.5" cy="27.5" rx="2.3" ry="1.5" fill="#FFF4E2" />

      {/* Eyes */}
      <ellipse cx="25" cy="34" rx="2.4" ry="2.8" fill="#2B1D14" />
      <ellipse cx="39" cy="34" rx="2.4" ry="2.8" fill="#2B1D14" />
      <circle cx="25.8" cy="33" r="0.8" fill="#FFFFFF" />
      <circle cx="39.8" cy="33" r="0.8" fill="#FFFFFF" />

      {/* Blush */}
      <ellipse cx="19.5" cy="40.5" rx="2.8" ry="1.7" fill="#F2A0A0" opacity="0.7" />
      <ellipse cx="44.5" cy="40.5" rx="2.8" ry="1.7" fill="#F2A0A0" opacity="0.7" />

      {/* Nose and smile */}
      <ellipse cx="32" cy="40" rx="3.2" ry="2.3" fill="#2B1D14" />
      <path
        d="M32 42.2 V44.2 M32 44.2 Q29.6 46.8 27 45 M32 44.2 Q34.4 46.8 37 45"
        fill="none"
        stroke="#2B1D14"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

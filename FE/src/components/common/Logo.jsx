export default function Logo({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Orange Flame / Drop shape */}
      <path
        d="M50 20C50 20 65 40 65 60C65 72 58 80 50 80C42 80 35 72 35 60C35 50 42 35 50 20Z"
        fill="url(#flameGradient)"
      />
      <path
        d="M50 40C50 40 58 55 58 65C58 70 54 75 50 75C46 75 42 70 42 65C42 58 46 50 50 40Z"
        fill="#FFFFFF"
        opacity="0.3"
      />
      
      {/* Blue Swoosh */}
      <path
        d="M45 80C30 78 18 65 18 50C18 38 25 28 35 23"
        stroke="url(#blueGradient)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M35 85C20 80 8 65 8 48"
        stroke="#6EC1E4"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Green Plus */}
      <rect x="75" y="25" width="20" height="8" rx="2" fill="#4CAF50" />
      <rect x="81" y="19" width="8" height="20" rx="2" fill="#4CAF50" />

      <defs>
        <linearGradient id="flameGradient" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9800" />
          <stop offset="1" stopColor="#FF5722" />
        </linearGradient>
        <linearGradient id="blueGradient" x1="18" y1="50" x2="45" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EC1E4" />
          <stop offset="1" stopColor="#18181B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

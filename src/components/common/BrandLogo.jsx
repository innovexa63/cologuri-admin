import { useId } from 'react';

export default function BrandLogo({
  theme = 'light', // 'light' (dark text for light bg) or 'dark' (white text for dark bg)
  className = 'h-10 w-auto',
  iconOnly = false,
  showSlogan = true,
  portalSubtitle = null, // e.g. "গ্রুপ অ্যাডমিন পোর্টাল" or "সুপার অ্যাডমিন"
  alt = 'চলোঘুড়ি',
}) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  const natureGradId = `natureGrad-${id}`;
  const hillDeepId = `hillDeep-${id}`;
  const hillSoftId = `hillSoft-${id}`;
  const skyKiteId = `skyKite-${id}`;
  const sunGoldId = `sunGold-${id}`;
  const softGlowId = `softGlow-${id}`;

  const isDark = theme === 'dark';
  const titleColor = isDark ? '#FFFFFF' : '#064e3b';
  const subColor = isDark ? '#6ee7b7' : '#059669';

  if (iconOnly) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="15 8 115 95"
        className={className}
        role="img"
        aria-label={alt}
      >
        <defs>
          <linearGradient id={hillDeepId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id={hillSoftId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id={skyKiteId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id={sunGoldId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id={softGlowId} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#047857" floodOpacity="0.25" />
          </filter>
        </defs>

        <g transform="translate(20, 14)" filter={`url(#${softGlowId})`}>
          <circle cx="56" cy="42" r="22" fill={`url(#${sunGoldId})`} opacity="0.95" />
          <path d="M 6 88 Q 38 32, 68 54 Q 90 40, 114 88 Z" fill={`url(#${hillSoftId})`} opacity="0.75" />
          <path d="M 18 90 L 52 38 L 86 90 Z" fill={`url(#${hillDeepId})`} />
          <path d="M 52 38 L 38 64 L 52 58 Z" fill="#6ee7b7" opacity="0.5" />
          <path d="M 50 62 C 40 70, 68 76, 32 94" fill="none" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
          <path d="M 48 64 C 42 71, 64 77, 34 92" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 3" />
          <g transform="translate(68, 6) rotate(12)">
            <polygon points="18,0 32,16 18,30 6,16" fill={`url(#${skyKiteId})`} />
            <polygon points="18,0 32,16 18,30 18,14" fill="#0369a1" />
            <polygon points="6,16 18,14 18,30" fill="#38bdf8" />
            <path d="M 18 30 Q 28 42, 14 50 T 24 64" fill="none" stroke={`url(#${sunGoldId})`} strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <path d="M 22 30 Q 25 27, 28 30 Q 31 27, 34 30" fill="none" stroke="#047857" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 135"
      className={className}
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id={natureGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor={isDark ? '#34d399' : '#047857'} />
        </linearGradient>

        <linearGradient id={hillDeepId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        <linearGradient id={hillSoftId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id={skyKiteId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id={sunGoldId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        <filter id={softGlowId} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#047857" floodOpacity={isDark ? 0.35 : 0.18} />
        </filter>
      </defs>

      {/* Emblem Mark */}
      <g transform="translate(20, 14)" filter={`url(#${softGlowId})`}>
        <circle cx="56" cy="42" r="22" fill={`url(#${sunGoldId})`} opacity="0.95" />
        <path d="M 6 88 Q 38 32, 68 54 Q 90 40, 114 88 Z" fill={`url(#${hillSoftId})`} opacity="0.65" />
        <path d="M 18 90 L 52 38 L 86 90 Z" fill={`url(#${hillDeepId})`} />
        <path d="M 52 38 L 38 64 L 52 58 Z" fill="#6ee7b7" opacity="0.45" />
        <path d="M 50 62 C 40 70, 68 76, 32 94" fill="none" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <path d="M 48 64 C 42 71, 64 77, 34 92" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 3" />
        <g transform="translate(68, 6) rotate(12)">
          <polygon points="18,0 32,16 18,30 6,16" fill={`url(#${skyKiteId})`} />
          <polygon points="18,0 32,16 18,30 18,14" fill="#0369a1" />
          <polygon points="6,16 18,14 18,30" fill="#38bdf8" />
          <path d="M 18 30 Q 28 42, 14 50 T 24 64" fill="none" stroke={`url(#${sunGoldId})`} strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <path d="M 22 30 Q 25 27, 28 30 Q 31 27, 34 30" fill="none" stroke="#047857" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* Typography */}
      <g transform="translate(155, 68)">
        <text
          x="0"
          y="0"
          style={{
            fontFamily: '"Tiro Bangla", serif',
            fontSize: '48px',
            fontWeight: 700,
            fill: titleColor,
          }}
        >
          চলো<tspan fill={`url(#${natureGradId})`}>ঘুড়ি</tspan>
        </text>

        {portalSubtitle ? (
          <>
            <text
              x="3"
              y="28"
              style={{
                fontFamily: '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '1px',
                fill: subColor,
              }}
            >
              {portalSubtitle}
            </text>
            <line x1="3" y1="38" x2="70" y2="38" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="78" cy="38" r="2.5" fill="#f59e0b" />
          </>
        ) : showSlogan ? (
          <>
            <text
              x="3"
              y="28"
              style={{
                fontFamily: '"Plus Jakarta Sans", "Noto Sans Bengali", sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '4.5px',
                fill: subColor,
              }}
            >
              EXPLORE NATURE • HILLS &amp; TRAILS
            </text>
            <line x1="3" y1="38" x2="60" y2="38" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="68" cy="38" r="2.5" fill="#f59e0b" />
          </>
        ) : null}
      </g>
    </svg>
  );
}

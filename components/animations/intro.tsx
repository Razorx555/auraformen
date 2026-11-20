import { BrandSymbol } from "@/components/ui/brand";

/**
 * Abertura cinematográfica (≈1,5 s), apenas CSS:
 * tela preta → símbolo cromado surge → brilho percorre → símbolo sobe e some.
 * - Nunca bloqueia cliques (pointer-events: none).
 * - Só na home, uma vez por sessão (script inline em app/layout.tsx).
 * - Desativada com prefers-reduced-motion.
 */
export function IntroOverlay() {
  return (
    <div aria-hidden className="intro-overlay pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-ink">
      <div className="intro-symbol relative w-[min(34vw,180px)]">
        <BrandSymbol eager sizes="180px" className="h-auto w-full" />
        <span className="intro-sheen absolute inset-0" />
      </div>
      <style>{`
        .intro-overlay { animation: intro-out .55s cubic-bezier(.22,1,.36,1) 1.15s forwards; }
        .intro-symbol { opacity: 0; animation: intro-in .7s cubic-bezier(.22,1,.36,1) .1s forwards, intro-rise .6s cubic-bezier(.22,1,.36,1) 1.05s forwards; }
        .intro-sheen {
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.85) 50%, transparent 65%);
          background-size: 250% 100%; background-position: 150% 0;
          -webkit-mask: url(/images/brand/simbolo.png) center/contain no-repeat;
                  mask: url(/images/brand/simbolo.png) center/contain no-repeat;
          mix-blend-mode: overlay;
          animation: intro-sheen .9s ease-in-out .45s forwards;
        }
        @keyframes intro-in { from { opacity: 0; transform: scale(.92); filter: blur(6px);} to { opacity: 1; transform: scale(1); filter: blur(0);} }
        @keyframes intro-rise { to { opacity: 0; transform: translateY(-38vh) scale(.35);} }
        @keyframes intro-sheen { to { background-position: -50% 0; } }
        @keyframes intro-out { to { opacity: 0; visibility: hidden; } }
        html[data-intro="skip"] .intro-overlay { display: none; }
        @media (prefers-reduced-motion: reduce) { .intro-overlay { display: none; } }
      `}</style>
    </div>
  );
}

/** Script executado antes da pintura: pula a abertura se já vista na sessão. */
export const introScript = `try{if(location.pathname!=='/'||sessionStorage.getItem('aura-intro')){document.documentElement.dataset.intro='skip'}else{sessionStorage.setItem('aura-intro','1');setTimeout(function(){document.documentElement.dataset.intro='skip'},1800)}}catch(e){}`;

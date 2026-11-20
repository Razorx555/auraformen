/** Transição de página: fade curto em CSS (não esconde o HTML antes da hidratação). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[page-in_.5s_cubic-bezier(.22,1,.36,1)_both]">{children}</div>;
}

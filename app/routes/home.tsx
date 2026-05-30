import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Casa Verde Bar — Reservas" },
    { name: "description", content: "Reserve sua área no Casa Verde Bar e Petiscaria" },
  ];
}

const areas = [
  {
    id: "1",
    name: "Churrasqueira Bar",
    image: "/lounge_area.png",
    capacity: "Até 15 pessoas",
    tag: "Pré-venda disponível",
    tagGreen: false,
    description: "Área íntima com mesa de sinuca e churrasqueira, integrada ao bar. Perfeita para grupos menores."
  },
  {
    id: "2",
    name: "Churrasqueira Garagem",
    image: "/private_room.png",
    capacity: "Até 50 pessoas",
    tag: "Desconto em produtos",
    tagGreen: true,
    description: "Espaço isolado para festas e confraternizações com churrasqueira e acesso privativo."
  }
];

export default function Home() {
  const [tablePeople, setTablePeople] = useState(2);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<"reservas" | "contato">("reservas");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById("contato");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActiveSection(entry.isIntersecting ? "contato" : "reservas"),
      { threshold: 0.1 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const incrementPeople = () => setTablePeople(p => Math.min(p + 1, 50));
  const decrementPeople = () => setTablePeople(p => Math.max(p - 1, 1));

  const navClass = (active: boolean) =>
    active
      ? "bg-white/15 text-white font-semibold px-4 py-2 rounded-full transition-all"
      : "text-white/60 font-medium px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all";

  return (
    <div className="min-h-screen bg-[#1a261e] text-white font-sans selection:bg-[#006b3e]/50 overflow-x-hidden">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-[#006b3e]/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-[#006b3e]/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 left-0 w-[350px] h-[350px] bg-[#ffcc29]/4 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="py-3 px-6 border-b border-white/8 bg-[#006b3e]/75 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img
            src="/logo.svg"
            alt="Casa Verde Bar"
            className="h-10 sm:h-11 w-auto drop-shadow-md transition-opacity duration-300"
            style={{ opacity: Math.min(1, scrollY / 150) }}
          />
          <nav className="hidden md:flex items-center gap-1">
            <a href="#reservas" className={navClass(activeSection === "reservas")}>Reservas</a>
            <a href="#contato" className={navClass(activeSection === "contato")}>Contato</a>
          </nav>
          <button className="md:hidden text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></svg>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 sm:py-12">

        {/* Hero logo */}
        <div
          className="flex justify-center mb-16 sm:mb-24 transition-all duration-75 ease-out pointer-events-none"
          style={{
            opacity: Math.max(0, 1 - scrollY / 250),
            transform: `scale(${Math.max(0.6, 1 - scrollY / 300)}) translateY(${scrollY * 0.3}px)`,
          }}
        >
          <img src="/logo.svg" alt="Casa Verde Bar" className="h-40 sm:h-52 lg:h-64 w-auto drop-shadow-2xl" />
        </div>

        {/* Section heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-[#ffcc29]/40" />
            <span className="text-[#ffcc29] text-xs font-bold uppercase tracking-[0.2em]">Reserve agora</span>
            <div className="h-px w-10 bg-[#ffcc29]/40" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Escolha seu espaço
          </h2>
          <p className="text-white/45 text-base sm:text-lg max-w-md mx-auto">
            Encontre o ambiente certo para a sua ocasião.
          </p>
        </div>

        {/* Cards */}
        <div id="reservas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {areas.map((area) => (
            <div
              key={area.id}
              className="group flex flex-col bg-[#283e31]/70 backdrop-blur-sm border border-white/8 rounded-3xl overflow-hidden hover:border-[#ffcc29]/25 transition-all duration-500 hover:shadow-[0_12px_60px_-15px_rgba(255,204,41,0.15)] hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c3025] via-[#1c3025]/20 to-transparent" />
                <span className="absolute top-3 right-3 text-xs font-medium bg-black/40 backdrop-blur-md border border-white/12 text-white/80 px-3 py-1 rounded-full">
                  {area.capacity}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{area.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">{area.description}</p>

                <div className="flex items-center gap-2 mb-5">
                  <div className={`w-1.5 h-1.5 rounded-full ${area.tagGreen ? "bg-emerald-400" : "bg-[#ffcc29]"}`} />
                  <span className="text-xs text-white/50">{area.tag}</span>
                </div>

                <Link
                  to={`/reservation/${area.id}`}
                  className="w-full py-3 rounded-2xl bg-[#ffcc29] text-[#1a261e] text-sm font-bold hover:bg-[#f5c420] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                >
                  Reservar
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-0.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          ))}

          {/* Mesa card */}
          <div className="group flex flex-col bg-[#283e31]/70 backdrop-blur-sm border border-white/8 rounded-3xl overflow-hidden hover:border-[#ffcc29]/25 transition-all duration-500 hover:shadow-[0_12px_60px_-15px_rgba(255,204,41,0.15)] hover:-translate-y-1">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src="/restaurant_table.png"
                alt="Reserva de Mesa"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c3025] via-[#1c3025]/20 to-transparent" />
              <span className="absolute top-3 right-3 text-xs font-medium bg-black/40 backdrop-blur-md border border-white/12 text-white/80 px-3 py-1 rounded-full">
                Salão principal
              </span>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Reserva de Mesa</h3>
              <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">
                Mesa no salão principal. Tolerância máxima de 15 minutos de atraso.
              </p>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Pessoas</label>
                <div className="flex items-center justify-between bg-[#1a261e]/80 border border-white/8 p-1 rounded-2xl">
                  <button
                    onClick={decrementPeople}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                  </button>
                  <span className="text-lg font-bold tabular-nums">{tablePeople}</span>
                  <button
                    onClick={incrementPeople}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              <Link
                to={`/reservation/3?people=${tablePeople}`}
                className="w-full py-3 rounded-2xl bg-[#ffcc29] text-[#1a261e] text-sm font-bold hover:bg-[#f5c420] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
              >
                Reservar Mesa
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-0.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer contato */}
      <footer id="contato" className="relative z-10 mt-24 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#ffcc29]/40" />
              <span className="text-[#ffcc29] text-xs font-bold uppercase tracking-[0.2em]">Fale conosco</span>
              <div className="h-px w-10 bg-[#ffcc29]/40" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Contato</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a
              href="https://maps.google.com/?q=R.+Gen.+Carneiro,+249+-+Centro,+Ponta+Grossa+-+PR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/7 hover:border-[#ffcc29]/20 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#ffcc29]/10 border border-[#ffcc29]/15 flex items-center justify-center group-hover:bg-[#ffcc29]/15 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <span className="text-white/60 text-sm text-center leading-relaxed group-hover:text-white/80 transition-colors">
                R. Gen. Carneiro, 249<br />Centro, Ponta Grossa – PR
              </span>
            </a>

            <a
              href="https://wa.me/5542998611022"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/7 hover:border-[#ffcc29]/20 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#ffcc29]/10 border border-[#ffcc29]/15 flex items-center justify-center group-hover:bg-[#ffcc29]/15 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffcc29"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              <span className="text-white/60 text-sm text-center group-hover:text-white/80 transition-colors">
                (42) 99861-1022
              </span>
            </a>

            <a
              href="https://www.instagram.com/casaverdebarpg/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/7 hover:border-[#ffcc29]/20 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#ffcc29]/10 border border-[#ffcc29]/15 flex items-center justify-center group-hover:bg-[#ffcc29]/15 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <span className="text-white/60 text-sm text-center group-hover:text-white/80 transition-colors">
                @casaverdebarpg
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Booking Area" },
    { name: "description", content: "Reserve sua área VIP" },
  ];
}

const areas = [
  {
    id: 1,
    name: "Churrasqueira Bar",
    image: "/lounge_area.png",
    capacity: "Até 15 pessoas",
    consumption: "Valor convertido em consumação",
    description: "Uma area para pequenos grupos com mesa de sinuca e churrasqueira, acoplada com o bar."
  },
  {
    id: 2,
    name: "Churrasqueira Garagem",
    image: "/private_room.png",
    capacity: "Até 50 pessoas",
    consumption: "Consumo aplica desconto",
    description: "Uma area grande isolada para festas e confraternizacoes com churrasqueira e acesso privativo."
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

  return (
    <div className="min-h-screen bg-[#1a261e] text-white font-sans selection:bg-[#006b3e]/50">
      <header className="py-4 px-6 border-b border-white/10 bg-[#006b3e]/90 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8 h-10 sm:h-12">
            <img 
              src="/logo.svg" 
              alt="Booking Area Logo" 
              className="h-10 sm:h-12 w-auto drop-shadow-md transition-opacity duration-300"
              style={{ opacity: Math.min(1, scrollY / 150) }}
            />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#reservas" className={activeSection === "reservas" ? "text-[#ffcc29] font-bold border-b-2 border-[#ffcc29] pb-1" : "text-white/80 font-medium hover:text-white transition-colors"}>Reservas</a>
            <a href="#contato" className={activeSection === "contato" ? "text-[#ffcc29] font-bold border-b-2 border-[#ffcc29] pb-1" : "text-white/80 font-medium hover:text-white transition-colors"}>Contato</a>
          </nav>
          <button className="md:hidden text-white hover:text-[#ffcc29] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 sm:py-12">
        <div 
          className="flex justify-center mb-12 sm:mb-20 transition-all duration-75 ease-out origin-center pointer-events-none"
          style={{ 
            opacity: Math.max(0, 1 - scrollY / 250),
            transform: `scale(${Math.max(0.6, 1 - scrollY / 300)}) translateY(${scrollY * 0.3}px)`,
          }}
        >
          <img src="/logo.svg" alt="Booking Area Logo Grande" className="h-40 sm:h-56 lg:h-64 w-auto drop-shadow-2xl" />
        </div>

        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Escolha seu espaço
          </h2>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Selecione a área ideal para o seu evento. Temos opções perfeitas para qualquer tamanho de grupo.
          </p>
        </div>

        <div id="reservas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {areas.map((area) => (
            <div
              key={area.id}
              className="group relative flex flex-col bg-[#283e31] border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#ffcc29]/40 transition-all duration-500 hover:shadow-[0_0_80px_-20px_rgba(255,204,41,0.25)]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#283e31] via-[#283e31]/20 to-transparent opacity-90" />
              </div>

              <div className="p-8 flex flex-col flex-1 relative -mt-16">
                <div className="flex justify-between items-end mb-6 gap-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{area.name}</h3>
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-xs sm:text-sm font-medium rounded-full border border-white/20 text-white whitespace-nowrap">
                    {area.capacity}
                  </span>
                </div>

                <p className="text-white/70 mb-8 flex-1 text-base sm:text-lg leading-relaxed">
                  {area.description}
                </p>

                <div className="flex items-center gap-3 mb-8 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${area.consumption.includes('Sem') ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-[#ffcc29] shadow-[#ffcc29]/50'}`} />
                  <span className="text-sm sm:text-base font-medium text-white/90">{area.consumption}</span>
                </div>

                <Link to={`/reservation/${area.id}`} className="w-full py-4 rounded-2xl bg-[#ffcc29] text-[#1a261e] text-lg font-bold hover:bg-[#f8bd2f] transition-all active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,204,41,0.4)] flex items-center justify-center gap-2">
                  Selecionar
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          ))}

          {/* Table Reservation Card */}
          <div className="group relative flex flex-col bg-[#283e31] border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#ffcc29]/40 transition-all duration-500 hover:shadow-[0_0_80px_-20px_rgba(255,204,41,0.25)]">
            <div className="aspect-[4/3] w-full overflow-hidden relative">
              <img
                src="/restaurant_table.png"
                alt="Reserva de Mesa"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#283e31] via-[#283e31]/20 to-transparent opacity-90" />
            </div>

            <div className="p-8 flex flex-col flex-1 relative -mt-16">
              <div className="flex justify-between items-end mb-6 gap-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">Reserva de Mesa</h3>
                <span className="px-3 py-1.5 bg-[#ffcc29]/20 backdrop-blur-md text-xs sm:text-sm font-bold rounded-full border border-[#ffcc29]/30 text-[#ffcc29] whitespace-nowrap">
                  Mesa Salão
                </span>
              </div>

              <p className="text-white/70 mb-6 flex-1 text-base sm:text-lg leading-relaxed">
                Reserve uma mesa no nosso salão principal. Escolha entre área interna ou externa.
              </p>

              <div className="mb-8">
                <label className="block text-sm font-medium text-white/70 mb-3 text-center">Quantidade de pessoas</label>
                <div className="flex items-center justify-between bg-[#1a261e] border border-white/10 p-2 rounded-2xl">
                  <button
                    onClick={decrementPeople}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                  </button>
                  <div className="text-2xl font-bold w-16 text-center tabular-nums text-white">
                    {tablePeople}
                  </div>
                  <button
                    onClick={incrementPeople}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              <Link to={`/reservation/3?people=${tablePeople}`} className="w-full py-4 rounded-2xl bg-[#ffcc29] text-[#1a261e] text-lg font-bold hover:bg-[#f8bd2f] transition-all active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,204,41,0.4)] flex items-center justify-center gap-2">
                Selecionar
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <footer id="contato" className="mt-16 border-t border-white/10 bg-[#283e31]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 text-center">Contato</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <a
              href="https://maps.google.com/?q=R.+Gen.+Carneiro,+249+-+Centro,+Ponta+Grossa+-+PR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffcc29]/40 hover:bg-white/10 transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="text-white/80 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">
                R. Gen. Carneiro, 249<br />Centro, Ponta Grossa – PR
              </span>
            </a>

            <a
              href="https://wa.me/5542998611022"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffcc29]/40 hover:bg-white/10 transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ffcc29"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                (42) 99861-1022
              </span>
            </a>

            <a
              href="https://www.instagram.com/casaverdebarpg/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffcc29]/40 hover:bg-white/10 transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                @casaverdebarpg
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

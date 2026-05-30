import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { Route } from "./+types/my-reservation";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "Minha Reserva" }];
}

type ReservationData = {
  token: string;
  areaId: string;
  areaName: string;
  areaImage: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  endTime: string;
  people: string;
  cart: Record<string, number>;
  totals: {
    finalTotal: number;
    finalReservationPrice: number;
    finalProductsTotal: number;
    discountValue: number;
    productDiscountValue: number;
    upfrontFee: number;
    remainingTotal: number;
  };
  createdAt: string;
};

export default function MyReservation() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    const data = sessionStorage.getItem(`reserva_${token}`);
    if (data) {
      setReservation(JSON.parse(data) as ReservationData);
    } else {
      setNotFound(true);
    }
  }, [token]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#1a261e] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Reserva não encontrada</h1>
          <p className="text-white/50 text-sm max-w-xs">O link pode ter expirado ou a reserva não existe neste dispositivo.</p>
        </div>
        <button onClick={() => navigate("/")} className="px-6 py-3 rounded-2xl bg-[#ffcc29] text-[#1a261e] font-bold text-sm hover:bg-[#f5c420] transition-all">
          Voltar ao início
        </button>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#1a261e] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/50">
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          Carregando...
        </div>
      </div>
    );
  }

  const { totals } = reservation;

  return (
    <div className="min-h-screen bg-[#1a261e] text-white font-sans selection:bg-[#006b3e]/50 pb-16">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-[#006b3e]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#006b3e]/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="py-3 px-6 border-b border-white/8 bg-[#006b3e]/75 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="p-2 rounded-xl bg-black/20 hover:bg-black/35 transition-colors text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <img src="/logo.svg" alt="Logo" className="h-9 w-auto drop-shadow-md" />
          </div>
          <span className="text-white/60 text-sm font-medium hidden sm:block">Minha Reserva</span>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Status banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          <div>
            <p className="text-emerald-400 font-semibold text-sm">Reserva solicitada</p>
            <p className="text-emerald-400/60 text-xs">Entraremos em contato para confirmar e cobrar o sinal.</p>
          </div>
        </div>

        {/* Área + data */}
        <div className="bg-[#283e31]/70 backdrop-blur-sm border border-white/8 rounded-3xl overflow-hidden">
          <div className="h-40 relative">
            <img src={reservation.areaImage} alt={reservation.areaName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#283e31] via-[#283e31]/30 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">Área reservada</p>
              <h2 className="text-2xl font-extrabold text-white">{reservation.areaName}</h2>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Data", value: formatDate(reservation.date) },
              { label: "Início", value: reservation.startTime },
              { label: "Término", value: reservation.endTime },
              { label: "Pessoas", value: reservation.people },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/4 border border-white/6 rounded-2xl p-4 text-center">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-white font-bold text-lg">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dados pessoais */}
        <div className="bg-[#283e31]/70 backdrop-blur-sm border border-white/8 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#ffcc29]/10 border border-[#ffcc29]/20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="text-base font-bold text-white">Dados Pessoais</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Nome", value: reservation.name },
              { label: "E-mail", value: reservation.email },
              { label: "WhatsApp", value: reservation.phone },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-white text-sm font-medium truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="bg-[#283e31]/70 backdrop-blur-sm border border-white/8 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#ffcc29]/10 border border-[#ffcc29]/20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-base font-bold text-white">Resumo Financeiro</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Taxa de reserva</span>
              <span className="text-white font-medium">{formatCurrency(totals.finalReservationPrice)}</span>
            </div>
            {totals.finalProductsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Produtos (pré-venda)</span>
                <span className="text-white font-medium">{formatCurrency(totals.finalProductsTotal)}</span>
              </div>
            )}
            {totals.discountValue > 0 && (
              <div className="flex justify-between text-sm bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-3 py-2.5">
                <span className="text-emerald-400">Desconto aplicado</span>
                <span className="text-emerald-400 font-semibold">− {formatCurrency(totals.discountValue)}</span>
              </div>
            )}
            <div className="border-t border-white/8 pt-3 flex justify-between items-center">
              <div>
                <p className="text-white font-bold">Total</p>
                {parseInt(reservation.people) > 1 && (
                  <p className="text-white/40 text-xs mt-0.5">{formatCurrency(totals.finalTotal / parseInt(reservation.people))} / pessoa</p>
                )}
              </div>
              <span className="text-[#ffcc29] font-extrabold text-xl">{formatCurrency(totals.finalTotal)}</span>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}

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
  status: "confirmed" | "cancelled";
  createdAt: string;
};

function canModify(dateStr: string) {
  const eventDate = new Date(`${dateStr}T00:00:00`);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return eventDate >= tomorrow;
}

export default function MyReservation() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem(`reserva_${token}`);
    if (data) {
      const parsed = JSON.parse(data) as ReservationData;
      setReservation(parsed);
      if (parsed.status === "cancelled") setCancelled(true);
    } else {
      setNotFound(true);
    }
  }, [token]);

  const handleCancel = () => {
    if (!reservation) return;
    const updated = { ...reservation, status: "cancelled" as const };
    sessionStorage.setItem(`reserva_${token}`, JSON.stringify(updated));
    setReservation(updated);
    setCancelled(true);
    setShowCancelModal(false);
  };

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

  const modifiable = canModify(reservation.date) && !cancelled;
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
        {cancelled ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            <div>
              <p className="text-red-400 font-semibold text-sm">Reserva cancelada</p>
              <p className="text-red-400/60 text-xs">Esta reserva foi cancelada e não está mais ativa.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            <div>
              <p className="text-emerald-400 font-semibold text-sm">Reserva solicitada</p>
              <p className="text-emerald-400/60 text-xs">
                {modifiable
                  ? "Entraremos em contato para confirmar e cobrar o sinal."
                  : "Prazo para alterações encerrado — o evento é amanhã ou já passou."}
              </p>
            </div>
          </div>
        )}

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
              <span className="text-white font-bold">Total</span>
              <span className="text-[#ffcc29] font-extrabold text-xl">{formatCurrency(totals.finalTotal)}</span>
            </div>
            {totals.upfrontFee > 0 && (
              <div className="bg-white/4 border border-white/6 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Sinal pago</span>
                  <span>{formatCurrency(totals.upfrontFee)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                  <span>Restante no local</span>
                  <span>{formatCurrency(totals.remainingTotal)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        {!cancelled && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/reservation/${reservation.areaId}?edit=${token}`)}
              disabled={!modifiable}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                modifiable
                  ? "bg-white/8 border border-white/15 text-white hover:bg-white/12 hover:border-white/25"
                  : "bg-white/4 border border-white/8 text-white/25 cursor-not-allowed"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Editar reserva
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={!modifiable}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                modifiable
                  ? "bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/15 hover:border-red-500/35"
                  : "bg-white/4 border border-white/8 text-white/25 cursor-not-allowed"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              Cancelar reserva
            </button>
          </div>
        )}

        {!modifiable && !cancelled && (
          <p className="text-center text-xs text-white/30">
            Alterações e cancelamentos só são permitidos até 1 dia antes do evento.
          </p>
        )}
      </main>

      {/* Modal de cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#283e31] border border-white/10 rounded-3xl p-8 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Cancelar reserva?</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Esta ação não pode ser desfeita. O sinal pago não é reembolsável conforme os termos de reserva.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-2xl bg-white/6 border border-white/10 text-white/80 font-semibold text-sm hover:bg-white/10 transition-all"
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all"
              >
                Confirmar cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useSubmit, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/reservation";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Finalizar Reserva" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const payload = {
    areaId: formData.get("areaId"),
    areaName: formData.get("areaName"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    startDateTime: formData.get("startDateTime"),
    endDateTime: formData.get("endDateTime"),
    people: formData.get("people"),
    cart: JSON.parse((formData.get("cart") as string) || "{}"),
    totals: JSON.parse((formData.get("totals") as string) || "{}"),
  };

  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("WEBHOOK_URL not configured");
    return { error: "Erro de configuração no servidor. WEBHOOK_URL não definida." };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Webhook failed:", await response.text());
      return { error: "Falha ao processar reserva no servidor." };
    }

    return { success: true };
  } catch (err) {
    console.error("Webhook error:", err);
    return { error: "Erro interno ao processar reserva." };
  }
}

// --- MOCKS ---
const mockAreas = [
  {
    id: "1",
    name: "Churrasqueira Bar",
    basePrice: 400,
    minPeople: 1,
    maxPeople: 15,
    openTime: "17:00",
    closeTime: "23:30",
    hasDiscountProducts: true,
    applyExcessToProducts: false,
    observations: "Acesso exclusivo à área VIP com atendimento dedicado. Proibida entrada de menores de 18 anos.",
    image: "/lounge_area.png",
    products: [
      { id: "p1", name: "Combo Absolut + RedBull", price: 350, discountPercent: 100 },
      { id: "p2", name: "Combo Gin Beefeater + Tônica", price: 400, discountPercent: 100 },
      { id: "p3", name: "Balde de Heineken (10 un)", price: 120, discountPercent: 100 },
      { id: "p4", name: "Chandon + 4 Energéticos", price: 450, discountPercent: 100 },
    ]
  },
  {
    id: "2",
    name: "Churrasqueira Garagem",
    basePrice: 400,
    minPeople: 15,
    maxPeople: 50,
    openTime: "16:00",
    closeTime: "23:30",
    hasDiscountProducts: true,
    applyExcessToProducts: true,
    observations: "Espaço isolado perfeito para comemorações particulares. Som independente.",
    image: "/private_room.png",
    products: [
      { id: "p1", name: "24 HEINEKEN 600ml ", price: 408, discountPercent: 30 },
      { id: "p2", name: "12 ANTARTICA LITÃO ", price: 192, discountPercent: 35 },
      { id: "p3", name: "24 ANTARTICA 600ml ", price: 312, discountPercent: 30 },
    ]
  },
  {
    id: "3",
    name: "Reserva de Mesa",
    basePrice: 100,
    minPeople: 1,
    maxPeople: 12,
    openTime: "18:00",
    closeTime: "02:00",
    hasDiscountProducts: false,
    applyExcessToProducts: false,
    observations: "Mesa no salão principal. Tolerância máxima de 15 minutos de atraso.",
    image: "/restaurant_table.png",
    products: []
  }
];

export default function Reservation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [area, setArea] = useState<typeof mockAreas[0] | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  // Form State
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState("");

  useEffect(() => {
    // Simulando fetch de API
    const foundArea = mockAreas.find(a => a.id === id);
    if (foundArea) {
      setArea(foundArea);

      // Pre-fill people if came from query params (e.g. Table reservation)
      const peopleParam = searchParams.get("people");
      if (peopleParam) {
        setPeople(peopleParam);
      }
    }
  }, [id, searchParams]);

  useEffect(() => {
    if (actionData?.success) {
      alert("Reserva confirmada com sucesso!");
      navigate("/");
    } else if (actionData?.error) {
      alert(actionData.error);
    }
  }, [actionData, navigate]);

  if (!area) {
    return <div className="min-h-screen bg-[#1a261e] flex items-center justify-center text-white">Carregando detalhes da reserva...</div>;
  }

  // Lógica de cálculo de totais
  const productsTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = area.products?.find((p: any) => p.id === pId);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const discountValue = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = area.products?.find((p: any) => p.id === pId);
    if (!prod) return sum;
    return sum + (prod.price * qty) * (prod.discountPercent / 100);
  }, 0);

  const actualDiscountValue = Math.min(discountValue, area.basePrice);
  const finalReservationPrice = area.basePrice - actualDiscountValue;

  const excessDiscountValue = area.applyExcessToProducts ? Math.max(0, discountValue - area.basePrice) : 0;
  const productDiscountValue = Math.min(excessDiscountValue, productsTotal);
  const finalProductsTotal = productsTotal - productDiscountValue;

  const finalTotal = finalReservationPrice + finalProductsTotal;
  const UPFRONT_FEE = 50;
  const remainingTotal = Math.max(0, finalTotal - UPFRONT_FEE);

  const peopleCount = parseInt(people) || 1;
  const pricePerPerson = finalTotal / peopleCount;
  const remainingPerPerson = remainingTotal / peopleCount;
  const reservationPerPerson = area.basePrice / peopleCount;
  const remainingReservationPerPerson = finalReservationPrice / peopleCount;

  // Gerenciamento do Carrinho
  const updateCart = (pId: string, delta: number) => {
    setCart(prev => {
      const current = prev[pId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const newCart = { ...prev };
        delete newCart[pId];
        return newCart;
      }
      return { ...prev, [pId]: next };
    });
  };

  // Data mínima (amanhã)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split("T")[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const generateDateTime = (dateStr: string, timeStr: string, isEnd: boolean = false, startStr: string = "00:00") => {
    const [startH] = startStr.split(":").map(Number);
    const [timeH] = timeStr.split(":").map(Number);

    const targetDate = new Date(`${dateStr}T00:00:00`);
    if (isEnd && timeH < startH) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const formattedDate = targetDate.toISOString().split("T")[0];
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const pad = (num: number) => String(num).padStart(2, '0');
    const tz = `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;

    return `${formattedDate}T${timeStr}:00${tz}`;
  };

  const handleConfirmAndPay = () => {
    if (!name || !email || !phone || !date || !startTime || !endTime || !people) {
      alert("Por favor, preencha todos os campos obrigatórios da reserva.");
      return;
    }

    const startDateTime = generateDateTime(date, startTime);
    const endDateTime = generateDateTime(date, endTime, true, startTime);

    submit({
      areaId: area.id,
      areaName: area.name,
      name,
      email,
      phone,
      date,
      startTime,
      endTime,
      startDateTime,
      endDateTime,
      people,
      cart: JSON.stringify(cart),
      totals: JSON.stringify({
        finalTotal,
        finalReservationPrice,
        finalProductsTotal,
        discountValue: actualDiscountValue,
        productDiscountValue,
        upfrontFee: UPFRONT_FEE,
        remainingTotal
      })
    }, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-[#1a261e] text-white font-sans selection:bg-[#006b3e]/50 pb-24">
      {/* Header Simplificado */}
      <header className="py-4 px-6 border-b border-white/10 bg-[#006b3e]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <img src="/logo.svg" alt="Logo" className="h-10 w-auto drop-shadow-md" />
          </div>
          <span className="text-[#ffcc29] font-bold text-lg hidden sm:block">Finalizar Reserva</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Lado Esquerdo: Formulário */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#283e31] p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-lg">
              <h2 className="text-3xl font-bold mb-8 text-[#ffcc29]">Dados da Reserva</h2>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    className="w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ffcc29] focus:ring-1 focus:ring-[#ffcc29] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Melhor E-mail */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Melhor E-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="joao@email.com"
                      className="w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ffcc29] focus:ring-1 focus:ring-[#ffcc29] transition-all"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">WhatsApp / Contato</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ffcc29] focus:ring-1 focus:ring-[#ffcc29] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Data */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Data (A partir de amanhã)</label>
                    <input
                      type="date"
                      required
                      min={minDateString}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffcc29] focus:ring-1 focus:ring-[#ffcc29] transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* Quantidade de Pessoas */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Pessoas (Mín: {area.minPeople} - Máx: {area.maxPeople})</label>
                    <input
                      type="number"
                      required
                      min={area.minPeople}
                      max={area.maxPeople}
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      placeholder="Ex: 4"
                      className="w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ffcc29] focus:ring-1 focus:ring-[#ffcc29] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Horário Início */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Início (A partir de {area.openTime})</label>
                    <input
                      type="time"
                      required
                      min={area.openTime}
                      max={area.closeTime}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffcc29] focus:ring-1 focus:ring-[#ffcc29] transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* Horário Término */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Término (Até {area.closeTime})</label>
                    <input
                      type="time"
                      required
                      min={startTime || area.openTime}
                      max={area.closeTime}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffcc29] focus:ring-1 focus:ring-[#ffcc29] transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

              </form>
            </div>

            {/* Produtos / Combos para Desconto */}
            {area.hasDiscountProducts && (
              <div className="bg-[#283e31] p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#ffcc29] flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                      Pré-venda de Consumo
                    </h2>
                    <p className="text-white/70 text-sm mt-1">Acrescente produtos e ganhe até 100% de isenção no valor da reserva!</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(area.products || []).map((product: any) => {
                    const qty = cart[product.id] || 0;
                    return (
                      <div key={product.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#1a261e] border border-white/5 rounded-2xl gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{product.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[#ffcc29] font-medium">{formatCurrency(product.price)}</span>
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Abate {product.discountPercent}% do valor na reserva
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-[#283e31] p-1.5 rounded-xl border border-white/10 shrink-0">
                          <button onClick={() => updateCart(product.id, -1)} disabled={qty === 0} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${qty > 0 ? 'bg-white/10 hover:bg-white/20 text-white' : 'opacity-50 text-white/30'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                          </button>
                          <span className="w-4 text-center font-bold">{qty}</span>
                          <button onClick={() => updateCart(product.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Lado Direito: Resumo */}
          <div className="lg:col-span-5">
            <div className="bg-[#283e31] border border-white/10 rounded-[2rem] overflow-hidden sticky top-28 shadow-2xl">

              <div className="h-48 w-full relative">
                <img src={area.image} alt={area.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#283e31] to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-3xl font-extrabold text-white drop-shadow-lg">{area.name}</h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="text-sm text-white/70 bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed">
                  <strong>Observações:</strong> {area.observations}
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-[#ffcc29] uppercase tracking-wider text-sm">Resumo dos Valores</h4>

                  <div className="flex justify-between items-start text-white/90">
                    <span>Taxa de Reserva</span>
                    <div className="text-right">
                      <div>{formatCurrency(area.basePrice)}</div>
                    </div>
                  </div>

                  {area.hasDiscountProducts && (
                    <>
                      <div className="flex justify-between items-center text-white/90">
                        <span>Produtos (Pré-venda)</span>
                        <span>{formatCurrency(productsTotal)}</span>
                      </div>

                      {actualDiscountValue > 0 && (
                        <>
                          <div className="flex justify-between items-center text-emerald-400 font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                            <span className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                              Consumação Abatida
                            </span>
                            <span>- {formatCurrency(actualDiscountValue)}</span>
                          </div>

                          <div className="flex justify-between items-start text-white/70 text-sm border-t border-white/5 pt-3 mt-3">
                            <span>Restante da Reserva</span>
                            <div className="text-right">
                              <div className={finalReservationPrice === 0 ? "text-emerald-400 font-bold" : "text-white"}>
                                {formatCurrency(finalReservationPrice)}
                              </div>
                              {peopleCount > 1 && finalReservationPrice > 0 && (
                                <div className="text-xs text-white/50 mt-0.5">{formatCurrency(remainingReservationPerPerson)} / pessoa</div>
                              )}
                            </div>
                          </div>

                          {productDiscountValue > 0 && (
                            <div className="flex justify-between items-center text-emerald-400 font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 mt-3">
                              <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                                Desconto nos Produtos
                              </span>
                              <span>- {formatCurrency(productDiscountValue)}</span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xl font-bold text-white">Sinal (Pagar Agora)</span>
                      <span className="text-3xl font-extrabold text-[#ffcc29]">{formatCurrency(UPFRONT_FEE)}</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-white/70 text-sm">
                        <span>Total Estimado (Reserva + Produtos)</span>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-400 font-bold text-sm">
                        <span>Restante a Pagar no Local</span>
                        <span>{formatCurrency(remainingTotal)}</span>
                      </div>
                      {peopleCount > 1 && (
                        <div className="flex justify-between items-center text-emerald-400/50 text-xs">
                          <span>Rateio no Local ({peopleCount} pessoas)</span>
                          <span>{formatCurrency(remainingPerPerson)} / pessoa</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmAndPay}
                  disabled={isSubmitting}
                  className={`w-full py-4 mt-4 rounded-2xl ${isSubmitting ? 'bg-[#ffcc29]/50 cursor-not-allowed' : 'bg-[#ffcc29] hover:bg-[#f8bd2f] hover:shadow-[0_0_20px_rgba(255,204,41,0.4)]'} text-[#1a261e] text-lg font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? "Processando..." : "Confirmar e Pagar"}
                  {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
                </button>

                <p className="text-xs text-center text-white/70 mt-4 leading-relaxed px-2 bg-black/20 p-3 rounded-xl border border-white/5">
                  <strong>Atenção:</strong> Será cobrada uma taxa de confirmação de <strong>{formatCurrency(UPFRONT_FEE)}</strong> agora. Em caso de cancelamento, este valor não é reembolsável (fica retido pelo estabelecimento). O restante da consumação e reserva será pago no dia do evento.
                </p>

                {area.hasDiscountProducts && !area.applyExcessToProducts && (
                  <>
                    <p className="text-xs text-center text-white/50 mt-4 leading-relaxed px-2">
                      * Os produtos não consumidos no dia do evento serão devolvidos em forma de crédito para uso futuro.
                    </p>

                  </>
                )}

                {area.hasDiscountProducts && area.applyExcessToProducts && (
                  <>
                    <p className="text-xs text-center text-white/50 mt-4 leading-relaxed px-2">
                      * Os produtos adquiridos na pré-venda que não forem consumidos no dia do evento retornarão como crédito no seu cadastro (com base no valor já com desconto aplicado).
                    </p>
                    <p className="text-xs text-center text-white/50 mt-4 leading-relaxed px-2">
                      * O valor excedente dos produtos será cobrado no dia do evento (com base no valor já com desconto aplicado).
                    </p>
                  </>
                )}

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

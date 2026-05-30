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
    calendarId: formData.get("calendarId"),
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Webhook failed:", await response.text());
      return { error: "Falha ao processar reserva no servidor." };
    }

    const token = crypto.randomUUID();
    const result = response.json ? await response.json() : null;
    return { success: true, token, message: result?.message };
  } catch (err) {
    console.error("Webhook error:", err);
    return { error: "Erro interno ao processar reserva." };
  }
}

// --- MOCKS ---
const mockAreas = [
  {
    id: "1",
    calendarId: "6a5434a1f376e4c3aade9330128fd8afa3d5d84f6c934fb9acd36c36605794d9@group.calendar.google.com",
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
      { id: "p1",  name: "Balde de Heineken (10 un)",       price: 120, discountPercent: 100, category: "Cervejas",        obs: "Long neck gelada, servida em balde com gelo.",                                               showObs: true  },
      { id: "p2",  name: "Balde de Budweiser (10 un)",       price: 130, discountPercent: 100, category: "Cervejas",        obs: "Long neck gelada, servida em balde com gelo.",                                               showObs: true  },
      { id: "p3",  name: "Combo Absolut + RedBull",          price: 350, discountPercent: 100, category: "Destilados",      obs: "1 garrafa Absolut 750ml + 4 latas RedBull.",                                                 showObs: true  },
      { id: "p4",  name: "Combo Gin Beefeater + Tônica",     price: 400, discountPercent: 100, category: "Destilados",      obs: "1 garrafa Beefeater 750ml + 4 tônicas + limão e gelo.",                                      showObs: true  },
      { id: "p5",  name: "Chandon + 4 Energéticos",          price: 450, discountPercent: 100, category: "Destilados",      obs: "1 garrafa Chandon Brut 750ml + 4 energéticos à escolha.",                                    showObs: true  },
      { id: "p6",  name: "Pack de Sucos (6 un)",             price:  60, discountPercent: 100, category: "Sem Álcool",      obs: "Sabores variados: laranja, uva, maracujá e manga.",                                          showObs: true  },
      { id: "p7",  name: "Água + Refrigerante Pack (12 un)", price:  80, discountPercent: 100, category: "Sem Álcool",      obs: "6 águas 500ml + 6 refrigerantes lata (Coca, Guaraná, Sprite).",                              showObs: true  },
      { id: "p8",  name: "Picanha 1kg",                      price: 160, discountPercent: 100, category: "Carnes", obs: "Picanha temperada, pronta para grelhar.",                                                    showObs: true  },
      { id: "p9",  name: "Frango Temperado 1kg",             price:  90, discountPercent: 100, category: "Carnes", obs: "Coxa e sobrecoxa marinadas com tempero da casa.",                                            showObs: true  },
      { id: "p10", name: "Churrasqueiro",                    price: 200, discountPercent: 100, category: "Serviços",        obs: "Profissional exclusivo para o preparo e corte das carnes durante o evento.",                  showObs: true  },
      { id: "p11", name: "Atendente Particular",             price: 150, discountPercent: 100, category: "Serviços",        obs: "Garçom dedicado à sua área durante todo o evento.",                                          showObs: true  },
    ]
  },
  {
    id: "2",
    calendarId: "j806ssogtb9oj0oda51fkudo7o@group.calendar.google.com",
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
      { id: "p1",  name: "24 Heineken 600ml",          price: 408, discountPercent: 30, category: "Cervejas",        obs: "Caixas lacradas, entregues geladas no início do evento.",                           showObs: true  },
      { id: "p2",  name: "24 Amstel 600ml",             price: 360, discountPercent: 30, category: "Cervejas",        obs: "Caixas lacradas, entregues geladas no início do evento.",                           showObs: true  },
      { id: "p3",  name: "12 Antarctica Litão",         price: 192, discountPercent: 35, category: "Cervejas",        obs: "Garrafas 1L, ideais para grupos grandes. Entregues geladas.",                      showObs: true  },
      { id: "p4",  name: "24 Antarctica 600ml",         price: 312, discountPercent: 30, category: "Cervejas",        obs: "Caixas lacradas, entregues geladas no início do evento.",                           showObs: true  },
      { id: "p5",  name: "Whisky Jack Daniel's 1L",     price: 220, discountPercent: 30, category: "Destilados",      obs: "Garrafa 1L + gelo e copos fornecidos.",                                             showObs: true  },
      { id: "p6",  name: "Vodka Absolut 1L",            price: 180, discountPercent: 30, category: "Destilados",      obs: "Garrafa 1L + gelo e copos fornecidos.",                                             showObs: true  },
      { id: "p7",  name: "Gin Beefeater 1L",            price: 190, discountPercent: 30, category: "Destilados",      obs: "Garrafa 1L + 4 tônicas, limão e gelo.",                                             showObs: true  },
      { id: "p8",  name: "Pack Refrigerante (12 un)",   price:  96, discountPercent: 30, category: "Sem Álcool",      obs: "Latas variadas: Coca-Cola, Guaraná Antarctica e Sprite.",                           showObs: true  },
      { id: "p9",  name: "Pack de Água (12 un)",        price:  60, discountPercent: 30, category: "Sem Álcool",      obs: "Garrafas 500ml, geladas.",                                                          showObs: true  },
      { id: "p10", name: "Combo Churrasco Completo",    price: 380, discountPercent: 30, category: "Carnes", obs: "Picanha 1kg + costela 1kg + linguiça 500g + frango 1kg, tudo temperado.",           showObs: true  },
      { id: "p11", name: "Picanha 2kg",                 price: 320, discountPercent: 30, category: "Carnes", obs: "Picanha temperada, pronta para grelhar.",                                            showObs: true  },
      { id: "p12", name: "Frango Temperado 2kg",        price: 160, discountPercent: 30, category: "Carnes", obs: "Coxa e sobrecoxa marinadas com tempero da casa.",                                   showObs: true  },
      { id: "p13", name: "Churrasqueiro",               price: 200, discountPercent: 30, category: "Serviços",        obs: "Profissional exclusivo para o preparo e corte das carnes durante o evento.",        showObs: true  },
      { id: "p14", name: "Atendente Particular",        price: 150, discountPercent: 30, category: "Serviços",        obs: "Garçom dedicado à sua área durante todo o evento.",                                 showObs: true  },
    ]
  },
  {
    id: "3",
    name: "Reserva de Mesa",
    calendarId: "9a317cfa23845f707090896bed13959a525c74fe97c03d77e2d3985ebc99bbfb@group.calendar.google.com",
    basePrice: 0,
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
  const [activeCategory, setActiveCategory] = useState<string>("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState("");

  useEffect(() => {
    const foundArea = mockAreas.find(a => a.id === id);
    if (foundArea) {
      setArea(foundArea);
      const peopleParam = searchParams.get("people");
      if (peopleParam) setPeople(peopleParam);
      if (foundArea.products.length > 0) {
        const firstCategory = (foundArea.products[0] as any).category as string;
        setActiveCategory(firstCategory);
      }
    }
  }, [id, searchParams]);

  useEffect(() => {
    if (actionData?.success && actionData.token) {
      const reservationData = {
        token: actionData.token,
        areaId: area?.calendarId,
        areaName: area?.name,
        areaImage: area?.image,
        name, email, phone, date, startTime, endTime, people,
        cart,
        totals: { finalTotal, finalReservationPrice, finalProductsTotal, discountValue: actualDiscountValue, productDiscountValue, upfrontFee: UPFRONT_FEE, remainingTotal },
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`reserva_${actionData.token}`, JSON.stringify(reservationData));
      navigate(`/minha-reserva/${actionData.token}`);
    } else if (actionData?.error) {
      alert(actionData.error);
    }
  }, [actionData, navigate]);

  if (!area) {
    return (
      <div className="min-h-screen bg-[#1a261e] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/50">
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          Carregando...
        </div>
      </div>
    );
  }

  // Cálculo de totais
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
  const UPFRONT_FEE = area.name === "Reserva de Mesa" ? 0 : 50;
  const remainingTotal = Math.max(0, finalTotal - UPFRONT_FEE);

  const peopleCount = parseInt(people) || 1;
  const pricePerPerson = finalTotal / peopleCount;
  const remainingPerPerson = remainingTotal / peopleCount;
  const reservationPerPerson = area.basePrice / peopleCount;
  const remainingReservationPerPerson = finalReservationPrice / peopleCount;

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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split("T")[0];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const generateDateTime = (dateStr: string, timeStr: string, isEnd: boolean = false, startStr: string = "00:00") => {
    const [startH] = startStr.split(":").map(Number);
    const [timeH] = timeStr.split(":").map(Number);
    const targetDate = new Date(`${dateStr}T00:00:00`);
    if (isEnd && timeH < startH) targetDate.setDate(targetDate.getDate() + 1);
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
      calendarId: (area as any).calendarId ?? "",
      areaName: area.name,
      name, email, phone, date, startTime, endTime,
      startDateTime, endDateTime, people,
      cart: JSON.stringify(cart),
      totals: JSON.stringify({
        finalTotal, finalReservationPrice, finalProductsTotal,
        discountValue: actualDiscountValue, productDiscountValue,
        upfrontFee: UPFRONT_FEE, remainingTotal
      })
    }, { method: "post" });
  };

  const inputClass = "w-full bg-[#1a261e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#ffcc29]/60 focus:ring-1 focus:ring-[#ffcc29]/30 transition-all";
  const labelClass = "block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-[#1a261e] text-white font-sans selection:bg-[#006b3e]/50 pb-24">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#006b3e]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#006b3e]/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="py-3 px-6 border-b border-white/8 bg-[#006b3e]/75 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/35 transition-colors text-white/80 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <img src="/logo.svg" alt="Logo" className="h-9 w-auto drop-shadow-md" />
          </div>
          <span className="text-[#ffcc29] font-semibold text-sm hidden sm:block tracking-wide">{area.name}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Formulário */}
          <div className="lg:col-span-7 space-y-5">

            {/* Dados pessoais */}
            <div className="bg-[#283e31]/70 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#ffcc29]/10 border border-[#ffcc29]/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h2 className="text-base font-bold text-white">Dados Pessoais</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Nome completo</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="João Silva" className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Data e horário */}
            <div className="bg-[#283e31]/70 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#ffcc29]/10 border border-[#ffcc29]/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <h2 className="text-base font-bold text-white">Data e Horário</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Data (a partir de amanhã)</label>
                    <input type="date" required min={minDateString} value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
                  </div>
                  <div>
                    <label className={labelClass}>Pessoas (mín. {area.minPeople} · máx. {area.maxPeople})</label>
                    <input type="number" required min={area.minPeople} max={area.maxPeople} value={people} onChange={(e) => setPeople(e.target.value)} placeholder="Ex: 4" className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Início (a partir de {area.openTime})</label>
                    <input type="time" required min={area.openTime} max={area.closeTime} value={startTime} onChange={(e) => setStartTime(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
                  </div>
                  <div>
                    <label className={labelClass}>Término (até {area.closeTime})</label>
                    <input type="time" required min={startTime || area.openTime} max={area.closeTime} value={endTime} onChange={(e) => setEndTime(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pré-venda */}
            {area.hasDiscountProducts && (() => {
              // v2: restaurar todas as categorias
              const categories = ["Cervejas"];
              const filtered = (area.products as any[]).filter(p => p.category === "Cervejas");
              const cartCountByCategory = (cat: string) =>
                (area.products as any[]).filter(p => p.category === cat).reduce((sum, p) => sum + (cart[p.id] || 0), 0);

              return (
                <div className="bg-[#283e31]/70 backdrop-blur-sm rounded-3xl border border-white/8 overflow-hidden">
                  {/* Header */}
                  <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-[#ffcc29]/10 border border-[#ffcc29]/20 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffcc29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                      </div>
                      <h2 className="text-base font-bold text-white">Pré-venda de Consumo</h2>
                    </div>
                    <p className="text-white/40 text-xs ml-11">Adicione produtos e abata até 100% da taxa de reserva.</p>
                  </div>

                  {/* Abas de categoria */}
                  <div className="px-6 sm:px-8 pb-4 flex gap-2 overflow-x-auto scrollbar-none justify-center">
                    {categories.map(cat => {
                      const count = cartCountByCategory(cat);
                      const isActive = cat === activeCategory;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                            isActive
                              ? "bg-[#ffcc29] text-[#1a261e]"
                              : "bg-white/6 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {cat}
                          {count > 0 && (
                            <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${isActive ? "bg-[#1a261e]/20 text-[#1a261e]" : "bg-[#ffcc29] text-[#1a261e]"}`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Produtos da categoria ativa */}
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
                    {filtered.map((product: any) => {
                      const qty = cart[product.id] || 0;
                      return (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${qty > 0 ? 'bg-[#ffcc29]/5 border-[#ffcc29]/20' : 'bg-[#1a261e]/60 border-white/5'}`}
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="font-semibold text-white text-sm">{product.name}</p>
                            {product.obs && product.showObs && (
                              <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{product.obs}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[#ffcc29] text-sm font-medium">{formatCurrency(product.price)}</span>
                              <span className="text-xs text-emerald-400/80 bg-emerald-400/8 border border-emerald-400/15 px-2 py-0.5 rounded-full">
                                -{product.discountPercent}% na reserva
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 bg-[#283e31] p-1 rounded-xl border border-white/8 shrink-0">
                            <button
                              onClick={() => updateCart(product.id, -1)}
                              disabled={qty === 0}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${qty > 0 ? 'bg-white/8 hover:bg-white/15 text-white' : 'opacity-30 text-white/50'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                            </button>
                            <span className="w-5 text-center text-sm font-bold tabular-nums">{qty}</span>
                            <button
                              onClick={() => updateCart(product.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/8 hover:bg-white/15 text-white transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Resumo */}
          <div className="lg:col-span-5">
            <div className="bg-[#283e31]/70 backdrop-blur-sm border border-white/8 rounded-3xl overflow-hidden sticky top-24">

              {/* Imagem da área */}
              <div className="h-44 w-full relative">
                <img src={area.image} alt={area.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#283e31] via-[#283e31]/40 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Reservando</span>
                  <h3 className="text-2xl font-extrabold text-white leading-tight">{area.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-5">

                {/* Observações */}
                <p className="text-white/45 text-xs leading-relaxed bg-white/4 border border-white/6 rounded-2xl p-4">
                  {area.observations}
                </p>

                {/* Valores */}
                <div>
                  <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Resumo</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Taxa de reserva</span>
                      <span className="font-semibold text-white">{formatCurrency(area.basePrice)}</span>
                    </div>

                    {area.hasDiscountProducts && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">Produtos (pré-venda)</span>
                          <span className="font-semibold text-white">{formatCurrency(productsTotal)}</span>
                        </div>

                        {actualDiscountValue > 0 && (
                          <>
                            <div className="flex justify-between items-center text-sm bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-3 py-2.5">
                              <span className="text-emerald-400 flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                Desconto consumação
                              </span>
                              <span className="text-emerald-400 font-semibold">− {formatCurrency(actualDiscountValue)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-white/50">Reserva restante</span>
                              <span className={`font-semibold ${finalReservationPrice === 0 ? "text-emerald-400" : "text-white"}`}>
                                {formatCurrency(finalReservationPrice)}
                              </span>
                            </div>
                          </>
                        )}

                        {productDiscountValue > 0 && (
                          <div className="flex justify-between items-center text-sm bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-3 py-2.5">
                            <span className="text-emerald-400 flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                              Desconto nos produtos
                            </span>
                            <span className="text-emerald-400 font-semibold">− {formatCurrency(productDiscountValue)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/8" />

                {/* Total */}
                {UPFRONT_FEE > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold text-sm">Sinal agora</p>
                        <p className="text-white/40 text-xs mt-0.5">Confirma a reserva</p>
                      </div>
                      <span className="text-3xl font-extrabold text-[#ffcc29]">{formatCurrency(UPFRONT_FEE)}</span>
                    </div>

                    <div className="bg-white/4 border border-white/6 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Total estimado</span>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                        <span>Pagar no local</span>
                        <span>{formatCurrency(remainingTotal)}</span>
                      </div>
                      {peopleCount > 1 && (
                        <div className="flex justify-between text-xs text-white/30 pt-1 border-t border-white/6">
                          <span>Rateio ({peopleCount} pessoas)</span>
                          <span>{formatCurrency(remainingPerPerson)} / pessoa</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold text-sm">Total da reserva</p>
                      {peopleCount > 1 && finalTotal > 0 && (
                        <p className="text-white/40 text-xs mt-0.5">{formatCurrency(finalTotal / peopleCount)} / pessoa</p>
                      )}
                    </div>
                    <span className="text-3xl font-extrabold text-[#ffcc29]">{formatCurrency(finalTotal)}</span>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleConfirmAndPay}
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl text-[#1a261e] text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isSubmitting ? 'bg-[#ffcc29]/50 cursor-not-allowed' : 'bg-[#ffcc29] hover:bg-[#f5c420] hover:shadow-[0_0_24px_rgba(255,204,41,0.35)]'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Reserva
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </>
                  )}
                </button>

                {/* Notas */}
                {UPFRONT_FEE > 0 && (
                  <p className="text-xs text-center text-white/35 leading-relaxed">
                    O sinal de {formatCurrency(UPFRONT_FEE)} não é reembolsável em caso de cancelamento.
                  </p>
                )}

                {area.hasDiscountProducts && !area.applyExcessToProducts && (
                  <p className="text-xs text-center text-white/30 leading-relaxed">
                    Produtos não consumidos serão revertidos em crédito para uso futuro.
                  </p>
                )}

                {area.hasDiscountProducts && area.applyExcessToProducts && (
                  <p className="text-xs text-center text-white/30 leading-relaxed">
                    Produtos não consumidos retornam como crédito no seu cadastro.
                  </p>
                )}

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

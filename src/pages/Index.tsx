import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/21a53ae9-1104-4196-b595-52d399b98ddd/files/32d9ca7d-6c24-42b4-893f-6d87bb7ffeeb.jpg";
const APIARY_IMAGE = "https://cdn.poehali.dev/projects/21a53ae9-1104-4196-b595-52d399b98ddd/files/3e74e9dc-78f7-4e4e-8ea9-9175090363c9.jpg";
const PRODUCTS_IMAGE = "https://cdn.poehali.dev/projects/21a53ae9-1104-4196-b595-52d399b98ddd/files/8158f26c-6822-4a35-916e-1739cff8641b.jpg";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  emoji: string;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Мёд липовый", description: "Светло-янтарный, нежный аромат цветущей липы. Собран в июле.", price: 680, unit: "500г", emoji: "🍯", badge: "Хит" },
  { id: 2, name: "Мёд гречишный", description: "Тёмный, насыщенный вкус с пряными нотками. Богат железом.", price: 720, unit: "500г", emoji: "🫙" },
  { id: 3, name: "Мёд луговой", description: "Многоцветковый, ароматный. Собран с разнотравья полевых лугов.", price: 650, unit: "500г", emoji: "🌸" },
  { id: 4, name: "Мёд таёжный", description: "Редкий сорт. Кедр, лиственница, дикие травы сибирской тайги.", price: 890, unit: "500г", emoji: "🌲", badge: "Редкий" },
  { id: 5, name: "Прополис настойка", description: "Натуральный прополис на спирту. Мощный природный антисептик.", price: 380, unit: "50мл", emoji: "💧" },
  { id: 6, name: "Перга пчелиная", description: "Законсервированная пчёлами пыльца. Кладезь витаминов и белка.", price: 950, unit: "200г", emoji: "🌼", badge: "Новинка" },
  { id: 7, name: "Маточное молочко", description: "Концентрированный продукт для иммунитета и долголетия.", price: 1200, unit: "30г", emoji: "✨" },
  { id: 8, name: "Воск пчелиный", description: "Натуральный жёлтый воск. Для косметики, свечей и пропитки.", price: 290, unit: "200г", emoji: "🕯️" },
];

const sections = ["главная", "каталог", "о продукции", "доставка", "контакты"];

export default function Index() {
  const [activeSection, setActiveSection] = useState("главная");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", comment: "" });

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const changeQty = (id: number, delta: number) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSent(true);
    setCart([]);
    setCartOpen(false);
    setForm({ name: "", phone: "", address: "", comment: "" });
    setTimeout(() => setOrderSent(false), 4000);
  };

  const scrollTo = (section: string) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("главная")}>
              <span className="text-2xl">🐝</span>
              <div>
                <div className="font-cormorant font-semibold text-xl text-honey leading-none">Пасека</div>
                <div className="text-xs text-muted-foreground leading-none font-golos">Натуральный мёд</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {sections.map(s => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`font-golos text-sm capitalize transition-colors ${
                    activeSection === s ? "text-honey font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-honey text-primary-foreground px-4 py-2 rounded-lg text-sm font-golos font-medium hover:bg-honey-dark transition-colors"
            >
              <Icon name="ShoppingBasket" size={16} />
              <span className="hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* SUCCESS TOAST */}
      {orderSent && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl animate-fade-in flex items-center gap-3">
          <Icon name="CheckCircle" size={20} />
          <div>
            <div className="font-semibold font-golos">Заказ принят!</div>
            <div className="text-sm opacity-90 font-golos">Свяжемся с вами в течение часа</div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-cormorant text-2xl font-semibold">Корзина</h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground p-8">
                <span className="text-6xl">🛒</span>
                <p className="font-golos text-center">Корзина пуста. Добавьте товары из каталога!</p>
                <button
                  onClick={() => { setCartOpen(false); scrollTo("каталог"); }}
                  className="bg-honey text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium font-golos hover:bg-honey-dark transition-colors"
                >
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <span className="text-3xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-golos font-medium text-sm truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.price} ₽ / {item.unit}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-accent text-sm font-golos">−</button>
                          <span className="font-golos font-semibold text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-accent text-sm font-golos">+</button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-golos font-semibold text-honey">{item.price * item.quantity} ₽</div>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-muted-foreground hover:text-destructive mt-1 font-golos transition-colors">удалить</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-golos text-muted-foreground">Итого:</span>
                    <span className="font-cormorant text-2xl font-semibold text-honey">{cartTotal} ₽</span>
                  </div>
                  <form onSubmit={handleOrder} className="space-y-3">
                    <input
                      required
                      placeholder="Ваше имя *"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-golos focus:outline-none focus:ring-2 focus:ring-honey/30"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Телефон *"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-golos focus:outline-none focus:ring-2 focus:ring-honey/30"
                    />
                    <input
                      placeholder="Адрес доставки"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-golos focus:outline-none focus:ring-2 focus:ring-honey/30"
                    />
                    <textarea
                      placeholder="Комментарий к заказу"
                      rows={2}
                      value={form.comment}
                      onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-golos focus:outline-none focus:ring-2 focus:ring-honey/30 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-honey text-primary-foreground py-3 rounded-lg font-golos font-semibold hover:bg-honey-dark transition-colors"
                    >
                      Оформить заказ
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="главная" className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Мёд" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brown/85 via-brown/55 to-transparent" />
        </div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-honey/20 border border-honey/40 text-honey-light backdrop-blur-sm px-4 py-2 rounded-full text-sm font-golos mb-6">
              🐝 Собственная пасека с 2008 года
            </div>
            <h1 className="font-cormorant text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
              Настоящий<br />
              <span className="text-honey-light italic">мёд</span><br />
              с пасеки
            </h1>
            <p className="font-golos text-lg text-white/80 mb-8 leading-relaxed">
              Натуральные продукты пчеловодства без химии и примесей.
              Собираем сами — продаём напрямую.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("каталог")}
                className="bg-honey text-primary-foreground px-8 py-3.5 rounded-xl font-golos font-semibold text-base hover:bg-honey-dark transition-all hover:scale-105"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => scrollTo("о продукции")}
                className="bg-white/20 border border-white/40 text-white px-8 py-3.5 rounded-xl font-golos font-semibold text-base backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                О нашей пасеке
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={24} className="text-white/60" />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-honey py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15+", label: "лет на пасеке" },
              { value: "120", label: "пчелосемей" },
              { value: "2000+", label: "довольных клиентов" },
            ].map((s) => (
              <div key={s.label} className="text-primary-foreground">
                <div className="font-cormorant text-4xl font-bold">{s.value}</div>
                <div className="font-golos text-sm opacity-80 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="каталог" className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="text-honey font-golos text-sm uppercase tracking-widest mb-3">Наша продукция</div>
            <h2 className="font-cormorant text-5xl font-bold text-foreground">Каталог товаров</h2>
            <hr className="section-divider mt-6 mb-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col hover-scale group"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {product.badge && (
                  <span className="self-start text-xs font-golos font-semibold bg-honey/15 text-honey px-2.5 py-1 rounded-full mb-3">
                    {product.badge}
                  </span>
                )}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {product.emoji}
                </div>
                <h3 className="font-cormorant text-xl font-semibold mb-2">{product.name}</h3>
                <p className="font-golos text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="font-cormorant text-2xl font-bold text-honey">{product.price} ₽</span>
                    <span className="font-golos text-xs text-muted-foreground ml-1">/{product.unit}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-honey text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center hover:bg-honey-dark transition-colors hover:scale-110"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider mx-8" />

      {/* ABOUT */}
      <section id="о продукции" className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-honey font-golos text-sm uppercase tracking-widest mb-3">О нас</div>
              <h2 className="font-cormorant text-5xl font-bold mb-6">Наша пасека</h2>
              <p className="font-golos text-muted-foreground leading-relaxed mb-6">
                Наша семейная пасека расположена в экологически чистом районе вдали от дорог и промышленных предприятий.
                Мы занимаемся пчеловодством с 2008 года и производим мёд по традиционным технологиям.
              </p>
              <p className="font-golos text-muted-foreground leading-relaxed mb-8">
                Каждая партия проходит контроль качества. Никаких антибиотиков, никаких добавок — только натуральный
                продукт, который создали пчёлы и природа.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "Leaf", text: "100% натуральный продукт без добавок" },
                  { icon: "Award", text: "Сертификаты качества Роспотребнадзора" },
                  { icon: "MapPin", text: "Собственная пасека в экологически чистой зоне" },
                  { icon: "Heart", text: "Производство с любовью уже 15 лет" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-honey/15 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as "Leaf"} size={16} className="text-honey" />
                    </div>
                    <span className="font-golos text-sm text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={APIARY_IMAGE}
                alt="Наша пасека"
                className="w-full h-96 object-cover rounded-3xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-5 shadow-lg max-w-xs">
                <div className="font-cormorant text-3xl font-bold text-honey mb-1">15 лет</div>
                <div className="font-golos text-sm text-muted-foreground">опыта пчеловодства</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider mx-8" />

      {/* PRODUCTS INFO */}
      <section className="py-20 bg-secondary/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="text-honey font-golos text-sm uppercase tracking-widest mb-3">Польза</div>
            <h2 className="font-cormorant text-5xl font-bold">Продукты пчеловодства</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="space-y-6">
              {[
                { emoji: "🍯", title: "Мёд", text: "Природный антисептик и источник энергии. Укрепляет иммунитет, улучшает сон и пищеварение." },
                { emoji: "💧", title: "Прополис", text: "Мощный антибактериальный агент. Применяется при простудах, ранах и воспалениях." },
                { emoji: "🌼", title: "Перга", text: "«Хлеб пчёл» — самый богатый природный источник аминокислот, витаминов и минералов." },
              ].map(item => (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <h4 className="font-cormorant text-xl font-semibold mb-1">{item.title}</h4>
                    <p className="font-golos text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
              <img src={PRODUCTS_IMAGE} alt="Продукты пчеловодства" className="w-full rounded-3xl shadow-xl h-full object-cover max-h-96" />
            </div>
            <div className="space-y-6">
              {[
                { emoji: "✨", title: "Маточное молочко", text: "Редкий и ценный продукт. Повышает жизненный тонус, укрепляет иммунную систему." },
                { emoji: "🕯️", title: "Воск", text: "Применяется в косметологии, народной медицине, для изготовления свечей и пропитки дерева." },
                { emoji: "🌿", title: "Цветочная пыльца", text: "Природный поливитаминный комплекс. Улучшает работу сердца и повышает работоспособность." },
              ].map(item => (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <h4 className="font-cormorant text-xl font-semibold mb-1">{item.title}</h4>
                    <p className="font-golos text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider mx-8" />

      {/* DELIVERY */}
      <section id="доставка" className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="text-honey font-golos text-sm uppercase tracking-widest mb-3">Логистика</div>
            <h2 className="font-cormorant text-5xl font-bold">Доставка</h2>
            <hr className="section-divider mt-6" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "Package", title: "Самовывоз", desc: "Бесплатно. Забираете сами с нашей пасеки или точки выдачи в городе. Уточняйте адрес по телефону.", label: "Бесплатно" },
              { icon: "Truck", title: "Курьер по городу", desc: "Доставка в день заказа при оформлении до 12:00. Стоимость от 200 ₽. Минимальная сумма заказа 500 ₽.", label: "от 200 ₽" },
              { icon: "Globe", title: "По России", desc: "Отправка Почтой России или СДЭК. Бережно упаковываем каждую баночку. Сроки 3–14 дней.", label: "от 350 ₽" },
            ].map(item => (
              <div key={item.title} className="bg-card border border-border rounded-2xl p-6 text-center hover-scale">
                <div className="w-14 h-14 bg-honey/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={item.icon as "Package"} size={24} className="text-honey" />
                </div>
                <div className="inline-block bg-honey/10 text-honey text-xs font-golos font-semibold px-3 py-1 rounded-full mb-3">{item.label}</div>
                <h3 className="font-cormorant text-xl font-semibold mb-3">{item.title}</h3>
                <p className="font-golos text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-accent/50 border border-honey/20 rounded-2xl p-6 flex gap-4 items-start">
            <Icon name="Info" size={20} className="text-honey flex-shrink-0 mt-0.5" />
            <p className="font-golos text-sm text-foreground leading-relaxed">
              При заказе на сумму <strong>от 3 000 ₽</strong> — доставка по городу бесплатно.
              При заказе <strong>от 5 000 ₽</strong> — скидка 10% и приоритетная отправка.
            </p>
          </div>
        </div>
      </section>

      <hr className="section-divider mx-8" />

      {/* CONTACTS */}
      <section id="контакты" className="py-20 bg-secondary/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="text-honey font-golos text-sm uppercase tracking-widest mb-3">Связь</div>
            <h2 className="font-cormorant text-5xl font-bold">Контакты</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="font-cormorant text-2xl font-semibold">Напишите нам</h3>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); setOrderSent(true); setTimeout(() => setOrderSent(false), 4000); }}>
                <input
                  required
                  placeholder="Ваше имя *"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm font-golos focus:outline-none focus:ring-2 focus:ring-honey/30"
                />
                <input
                  required
                  type="tel"
                  placeholder="Телефон или email *"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm font-golos focus:outline-none focus:ring-2 focus:ring-honey/30"
                />
                <textarea
                  rows={4}
                  placeholder="Ваш вопрос или сообщение..."
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm font-golos focus:outline-none focus:ring-2 focus:ring-honey/30 resize-none"
                />
                <button
                  type="submit"
                  className="bg-honey text-primary-foreground px-8 py-3 rounded-xl font-golos font-semibold hover:bg-honey-dark transition-colors"
                >
                  Отправить сообщение
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <h3 className="font-cormorant text-2xl font-semibold">Реквизиты</h3>
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (900) 000-00-00" },
                  { icon: "Mail", label: "Email", value: "info@paseka.ru" },
                  { icon: "MapPin", label: "Адрес пасеки", value: "Россия, Тульская область, д. Медовое" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 9:00–18:00, Сб: 10:00–15:00" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-10 h-10 bg-honey/15 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as "Phone"} size={18} className="text-honey" />
                    </div>
                    <div>
                      <div className="font-golos text-xs text-muted-foreground mb-0.5">{item.label}</div>
                      <div className="font-golos text-sm font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl text-sm font-golos hover:bg-accent transition-colors">
                  <Icon name="Send" size={16} className="text-honey" />
                  Написать в Telegram
                </button>
                <button className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl text-sm font-golos hover:bg-accent transition-colors">
                  <Icon name="Phone" size={16} className="text-honey" />
                  Позвонить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐝</span>
              <div>
                <div className="font-cormorant text-xl font-semibold text-honey-light">Пасека</div>
                <div className="text-xs opacity-60 font-golos">Натуральный мёд с 2008 года</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {sections.map(s => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="font-golos text-sm capitalize opacity-60 hover:opacity-100 hover:text-honey-light transition-all"
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="font-golos text-xs opacity-40">© 2024 Пасека. Все права защищены.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
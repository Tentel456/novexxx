import HomeHeader from "@/components/layout/HomeHeader";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <HomeHeader />
      
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_88%_42%,rgba(37,99,235,0.09)_0%,rgba(147,197,253,0.04)_35%,transparent_58%)]" />
        
        <div className="container max-w-[1550px] mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start py-12 lg:py-16">
            {/* Hero Content */}
            <div className="mt-8 ml-0 lg:ml-8">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#edf3fd] border border-[#d8dbe0]">
                <Image src="/novex-home/shield.svg" alt="" width={14} height={18} />
                <span className="text-[#2563eb] text-sm font-semibold">Надежная криптобиржа №1</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-[#0f172a] mb-8">
                Покупайте, торгуйте и инвестируйте в <span className="text-[#2563eb]">криптовалюту</span> на NOVEX
              </h1>
              
              <p className="text-lg text-[#7d7c8d] font-medium mb-12 max-w-md">
                Безопасная и удобная платформа для торговли криптовалютами. Присоединяйтесь к миллионам пользователей по всему миру.
              </p>
              
              <div className="mb-16">
                <Link 
                  href="/auth" 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-[#2563eb] text-white text-lg font-semibold rounded-xl hover:bg-[#1d4ed8] transition shadow-lg shadow-blue-500/35"
                >
                  Создать аккаунт
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
              
              <ul className="flex flex-wrap items-center gap-0">
                <li className="flex items-center gap-3 pr-7 font-semibold text-sm text-[#0f172a]">
                  <Image src="/novex-home/shield.svg" alt="" width={18} height={22} />
                  <span>Без скрытых комиссий</span>
                </li>
                <li className="flex items-center gap-3 px-7 border-l-2 border-[#e2e8f0] font-semibold text-sm text-[#0f172a]">
                  <Image src="/novex-home/bolt-logo.svg" alt="" width={16} height={22} />
                  <span>Высокая ликвидность</span>
                </li>
                <li className="flex items-center gap-3 pl-7 border-l-2 border-[#e2e8f0] font-semibold text-sm text-[#0f172a]">
                  <Image src="/novex-home/support-logo.svg" alt="" width={20} height={22} />
                  <span>Поддержка 24/7</span>
                </li>
              </ul>
            </div>
            
            {/* Hero Image */}
            <div className="relative flex justify-end items-center z-0">
              <div className="absolute inset-0 top-[27%] bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.35),rgba(37,99,235,0.08)_55%,transparent_80%)] blur-[26px] opacity-90 -z-10 rounded-[4000px]" />
              <Image 
                src="/novex-home/main-img.png" 
                alt="NOVEX Platform" 
                width={620} 
                height={640} 
                className="w-full max-w-[620px] h-auto relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gift Promo Section */}
      <section className="py-16 bg-[#fcfcfd]">
        <div className="container max-w-[1550px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12">
            <div className="flex-shrink-0">
              <Image src="/novex-home/gift-img.png" alt="Bonus" width={320} height={280} />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
                Присоединяйтесь к <span className="text-[#2563eb]">NOVEX</span> и получите до 100 <span className="text-[#2563eb]">USDT</span> бонусов!
              </h2>
              <p className="text-lg text-[#64748b] font-medium">
                Зарегистрируйтесь сейчас и начните свой путь в мире цифровых активов.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/auth" className="inline-block px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition">
                Получить бонус
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-[1550px] mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-2 bg-[#edf3fd] text-[#2b6aff] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              ПРОСТОЙ СТАРТ
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4 tracking-tight">
              Как начать?
            </h2>
            <p className="text-lg text-[#64748b] font-medium">
              Всего 4 шага, чтобы начать торговать и инвестировать в криптовалюту
            </p>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[35px]">
            {[
              { num: 1, img: "card-about-1.png", title: "Создайте аккаунт", text: "Зарегистрируйтесь за пару минут и подтвердите email" },
              { num: 2, img: "card-about-2.png", title: "Пополните баланс", text: "Выберите удобный способ пополнения счета и внесите средства" },
              { num: 3, img: "card-about-3.png", title: "Начните торговлю", text: "Покупайте и продавайте криптовалюту легко и безопасно" },
              { num: 4, img: "card-about-4.png", title: "Получайте прибыль", text: "Инвестируйте и увеличивайте свой капитал вместе с NOVEX" }
            ].map((step, index) => (
              <div key={step.num} className="relative bg-white rounded-2xl border border-[#e8ecf1] shadow-lg p-6 text-center overflow-visible">
                {/* Connector Arrow (for steps 2, 3, 4) */}
                {index > 0 && (
                  <div className="hidden lg:block absolute left-0 top-[48%] -translate-x-1/2 -translate-y-1/2 z-10 w-[71px] h-10 pointer-events-none">
                    {/* Dashed Line */}
                    <span className="absolute left-0 right-[calc(50%+15px)] top-1/2 -translate-y-1/2 h-px bg-[repeating-linear-gradient(90deg,#0052ff_0,#0052ff_5px,transparent_5px,transparent_9px)]" />
                    {/* Circle with Arrow */}
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] flex items-center justify-center rounded-full bg-white border border-[#ced1d6] shadow-sm">
                      <Image src="/novex-home/arrow-right.svg" alt="" width={12} height={10} className="object-contain" />
                    </span>
                  </div>
                )}
                
                <span className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center bg-[#0052ff] text-white font-medium rounded-full text-sm z-10">
                  {step.num}
                </span>
                <Image src={`/novex-home/${step.img}`} alt="" width={200} height={200} className="mx-auto my-4" />
                <h3 className="text-xl font-bold text-[#0f172a] mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748b] font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Trading Section */}
      <section className="py-16 bg-[#fcfcfd]">
        <div className="container max-w-[1550px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-[#f0f5ff] rounded-2xl border border-[#94a3b8]/25 shadow-xl p-8 lg:p-12">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
                Начните торговать уже сегодня
              </h2>
              <p className="text-lg text-[#64748b] font-medium mb-8">
                Создайте аккаунт за пару минут и получите полный доступ к платформе
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Image src="/novex-home/shield.svg" alt="" width={22} height={22} />
                  <span className="text-sm font-semibold text-[#475569]">Без скрытых комиссий</span>
                </div>
                <div className="flex items-center gap-3 md:border-l md:border-[#cbd5e1] md:pl-4">
                  <Image src="/novex-home/bolt-logo.svg" alt="" width={22} height={22} />
                  <span className="text-sm font-semibold text-[#475569]">Высокая ликвидность</span>
                </div>
                <div className="flex items-center gap-3 md:border-l md:border-[#cbd5e1] md:pl-4">
                  <Image src="/novex-home/support-logo.svg" alt="" width={22} height={22} />
                  <span className="text-sm font-semibold text-[#475569]">Поддержка 24/7</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Link href="/auth" className="inline-flex items-center gap-3 px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition whitespace-nowrap">
                Создать аккаунт
                <Image src="/novex-home/arrow-right.svg" alt="" width={15} height={13} className="brightness-0 invert" />
              </Link>
              <p className="text-sm text-[#64748b] font-medium text-center">
                Начните свой путь к финансовой свободе
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-[1550px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-7">
            {/* Left - Title & Subtitle */}
            <div className="flex-shrink-0 max-w-[375px]">
              <h2 className="text-[32px] font-bold text-[#111827] mb-3 leading-[1.4] tracking-tight">
                Платформа, которой доверяют миллионы
              </h2>
              <p className="text-base text-[#64748b] font-medium leading-[1.75]">
                Высокая ликвидность, надежность и стабильность — каждый день
              </p>
            </div>
            
            {/* Right - Stats Cards Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: "bank-logo.svg", value: "150+", label: "Торговых пар" },
                { icon: "users-logo.svg", value: "1M+", label: "Пользователей по всему миру" },
                { icon: "graphic-logo.svg", value: "$2B+", label: "Объем торгов (24ч)" },
                { icon: "shield-card.svg", value: "99.9%", label: "Надежность платформы" },
                { icon: "global-logo.svg", value: "50+", label: "Стран присутствия" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-transparent rounded-2xl border border-[#eef0f4] shadow-sm p-5 text-center">
                  <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-full bg-[#f0f7ff] flex items-center justify-center">
                    <Image src={`/novex-home/${stat.icon}`} alt="" width={40} height={40} />
                  </div>
                  <p className="text-[22px] font-extrabold text-[#111827] mb-2 leading-tight tracking-tight">{stat.value}</p>
                  <p className="text-[13px] text-[#6b7280] font-medium leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-[#475569] font-medium">
            <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
            Данные обновляются в режиме реального времени
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fcfcfd] border-t border-[#e5e7eb] py-16">
        <div className="container max-w-[1550px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="text-3xl font-black text-[#0f172a] mb-4 inline-block">
                NOVEX
              </Link>
              <p className="text-[#64748b] font-medium mb-6 max-w-sm">
                Надежная платформа для торговли и инвестиций в цифровые активы
              </p>
              <div className="flex items-center gap-3.5 mt-4">
                <Link href="#" className="flex items-center justify-center hover:opacity-100 hover:-translate-y-0.5 transition-all">
                  <Image src="/novex-home/tg-logo.svg" alt="Telegram" width={26} height={26} className="object-contain" />
                </Link>
                <Link href="#" className="flex items-center justify-center hover:opacity-100 hover:-translate-y-0.5 transition-all">
                  <Image src="/novex-home/twitter-logo.svg" alt="Twitter" width={26} height={26} className="object-contain" />
                </Link>
                <Link href="#" className="flex items-center justify-center hover:opacity-100 hover:-translate-y-0.5 transition-all">
                  <Image src="/novex-home/discord-logo.svg" alt="Discord" width={26} height={26} className="object-contain" />
                </Link>
                <Link href="#" className="flex items-center justify-center hover:opacity-100 hover:-translate-y-0.5 transition-all">
                  <Image src="/novex-home/youtube-logo.svg" alt="YouTube" width={26} height={26} className="object-contain" />
                </Link>
              </div>
            </div>
            
            {/* Products */}
            <div>
              <h3 className="text-[#0f172a] font-bold mb-4">Продукты</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Купить криптовалюту</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Торговля</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Конвертация</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Кошелек</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-[#0f172a] font-bold mb-4">Компания</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">О нас</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Вакансии</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Партнерская программа</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Блог</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Новости</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-[#0f172a] font-bold mb-4">Поддержка</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Центр поддержки</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Документация</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Статус системы</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Связаться с нами</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">API</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-[#0f172a] font-bold mb-4">Правовая информация</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Пользовательское соглашение</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Политика конфиденциальности</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Политика AML и KYC</Link></li>
                <li><Link href="#" className="text-[#64748b] hover:text-[#0f172a] transition text-sm">Условия использования</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#e5e7eb] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#64748b]">
              © 2026 NOVEX. Все права защищены.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-[#64748b] hover:text-[#0f172a] transition">Условия использования</Link>
              <Link href="#" className="text-sm text-[#64748b] hover:text-[#0f172a] transition">Политика конфиденциальности</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

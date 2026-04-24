import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="px-4 pb-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-12 flex-wrap lg:flex-nowrap">
          {/* Left Content */}
          <div className="w-full lg:w-[700px]">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#cbdce5] mb-14">
              Быстрее. Умнее. Технологичнее. Криптобиржа нового поколения
            </h1>
            <p className="text-xl font-light leading-relaxed mb-14">
              NOVEX — платформа для криптотрейдинга с ликвидностью с скоростью институционального уровня.
            </p>
            <div className="flex gap-6 flex-col sm:flex-row">
              <Link
                href="/auth"
                className="text-center px-10 py-6 bg-white text-black font-bold rounded-full hover:opacity-90 transition"
              >
                Создать аккаунт
              </Link>
              <Link
                href="/p2p"
                className="text-center px-10 py-6 border-2 border-transparent rounded-md hover:opacity-90 transition relative"
                style={{
                  background: 'transparent',
                  border: '1.3px solid transparent',
                  backgroundImage: 'linear-gradient(black, black), linear-gradient(147.72deg, #3fc2e3 51.54%, #245aa6 80.65%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }}
              >
                Начать торговлю
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block w-[677px] relative">
            <div className="absolute w-[992px] h-[797px] -left-[169px] -top-4 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.0045)_100%)] -z-10" />
            <Image
              src="/first-page/images/main-img.png"
              alt="NOVEX Platform"
              width={900}
              height={725}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

const features = [
  {
    icon: "/first-page/images/info-card-1.svg",
    title: "Прозрачность и надёжность",
    description: "Торгуйте без колебаний. Более 70 млн трейдеров захватывают каждое движение рынка с помощью NOVEX.",
  },
  {
    icon: "/first-page/images/info-card-2.svg",
    title: "Поддержка 24/7",
    description: "Торгуйте без колебаний. Более 70 млн трейдеров захватывают каждое движение рынка с помощью NOVEX.",
  },
  {
    icon: "/first-page/images/info-card-3.svg",
    title: "Нулевые комиссии в сети bep20, trc20",
    description: "Торгуйте без колебаний. Более 70 млн трейдеров захватывают каждое движение рынка с помощью NOVEX.",
  },
];

export default function Features() {
  return (
    <section className="mt-32 mb-6 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-5xl text-center leading-tight mb-12">
          Ваш надёжный партнёр для торговли криптовалютой
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <Image
                src={feature.icon}
                alt={feature.title}
                width={80}
                height={80}
                className="mx-auto mb-10"
              />
              <h3 className="text-xl font-medium mb-8 max-w-[300px] mx-auto leading-tight">
                {feature.title}
              </h3>
              <p className="text-sm font-light max-w-[275px] mx-auto leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <button className="block mx-auto px-9 py-5 bg-white text-black font-normal text-xl rounded-full hover:opacity-90 transition">
          Внести криптовалюту
        </button>
      </div>
    </section>
  );
}

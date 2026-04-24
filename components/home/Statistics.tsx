import Image from "next/image";

const cryptoData = [
  { icon: "/first-page/images/eth-logo.svg", name: "ETH", price: "3 083,00 $", change: "+2,87%", big: true },
  { icon: "/first-page/images/usdt-logo.svg", name: "USDT", price: "1,0002 $", change: "+0,03%", big: false },
  { icon: "/first-page/images/btc-logo.svg", name: "BTC", price: "92 484,10 $", change: "+2,19%", big: false },
];

export default function Statistics() {
  return (
    <section className="mt-32 mb-6 px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between flex-wrap lg:flex-nowrap gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-[670px]">
            <h2 className="text-5xl font-bold mb-16 leading-tight">
              Следи за ростом криптовалюты!
            </h2>
            <div className="flex gap-10 items-end mb-14 flex-wrap md:flex-nowrap">
              {cryptoData.map((crypto, index) => (
                <div
                  key={index}
                  className={`border-2 border-white rounded-2xl p-8 ${
                    crypto.big ? 'w-full md:w-[200px]' : 'w-full md:w-[188px]'
                  }`}
                >
                  <Image
                    src={crypto.icon}
                    alt={crypto.name}
                    width={crypto.big ? 80 : 70}
                    height={crypto.big ? 80 : 70}
                    className="mb-9"
                  />
                  <p className={`font-normal mb-4 ${crypto.big ? 'text-3xl' : 'text-2xl'}`}>
                    {crypto.name}
                  </p>
                  <p className={`font-normal leading-tight mb-3 ${crypto.big ? 'text-3xl' : 'text-2xl'}`}>
                    {crypto.price}
                  </p>
                  <p className={`text-[#40ff00] font-normal ${crypto.big ? 'text-3xl' : 'text-2xl'}`}>
                    {crypto.change}
                  </p>
                </div>
              ))}
            </div>
            <button className="px-10 py-5 bg-white text-black font-normal text-xl rounded-full hover:opacity-90 transition w-full md:w-auto">
              Купить криптовалюту
            </button>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block w-[731px] relative h-[700px]">
            <div className="absolute w-[769px] h-[553px] left-7 top-48 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_100%)] -z-10" />
            <Image
              src="/first-page/images/statistics-img.png"
              alt="Statistics"
              width={700}
              height={720}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

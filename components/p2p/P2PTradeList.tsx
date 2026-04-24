"use client";

interface P2PTradeListProps {
  activeTab: "buy" | "sell";
}

interface TradeOffer {
  maker: string;
  transactions: number;
  completion: number;
  price: string;
  available: string;
  limit: string;
  payments: Array<"sber" | "tbank">;
}

const buyOffers: TradeOffer[] = [
  {
    maker: "NOVEXNOVEX",
    transactions: 15205,
    completion: 99.7,
    price: "0,997 USD",
    available: "1 642,95 USDT",
    limit: "10,00–1 638,02 $",
    payments: ["sber", "tbank"],
  },
  {
    maker: "PAVELDUROV",
    transactions: 7902,
    completion: 96.3,
    price: "0,923 USD",
    available: "1 642,95 USDT",
    limit: "5,00–1 3 $",
    payments: ["sber", "tbank"],
  },
];

const sellOffers: TradeOffer[] = [
  {
    maker: "KYPIKRIPTY",
    transactions: 15205,
    completion: 99.7,
    price: "1,284 USD",
    available: "1 642,95 USDT",
    limit: "10,00 – 1 638,02 $",
    payments: ["sber", "tbank"],
  },
  {
    maker: "PAVELDUROV",
    transactions: 7902,
    completion: 96.3,
    price: "1,282 USD",
    available: "579,85 USDT",
    limit: "5,00-743,94 USD",
    payments: ["sber", "tbank"],
  },
];

export default function P2PTradeList({ activeTab }: P2PTradeListProps) {
  const offers = activeTab === "buy" ? buyOffers : sellOffers;
  const actionText = activeTab === "buy" ? "Купить" : "Продать";
  const actionColor = activeTab === "buy" ? "bg-[#40ff00]" : "bg-[#ff3300]";

  return (
    <div className="mt-11">
      {/* Desktop View */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="grid grid-cols-5 gap-8 pb-6 border-b border-white/20 mb-6">
          <div className="text-sm font-bold">Мейкеры</div>
          <div className="text-sm font-bold">Цена</div>
          <div className="text-sm font-bold">Доступный лимит / лимит для ордеров</div>
          <div className="text-sm font-bold">Способы оплаты</div>
          <div className="text-sm font-bold">Купить/продать</div>
        </div>

        {/* Offers */}
        {offers.map((offer, index) => (
          <div key={index} className="grid grid-cols-5 gap-8 mb-12">
            {/* Maker */}
            <div>
              <div className="text-lg font-bold mb-1">{offer.maker}</div>
              <div className="flex flex-col gap-1 text-sm">
                <span>Транзакции {offer.transactions.toLocaleString()}</span>
                <span>Исполнено ордеров: {offer.completion}%</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-base font-bold">{offer.price}</div>

            {/* Limits */}
            <div className="flex flex-col gap-2 text-sm font-bold">
              <span>{offer.available}</span>
              <span>{offer.limit}</span>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col gap-2 ml-2">
              {offer.payments.map((payment, i) => (
                <span
                  key={i}
                  className={`text-sm font-bold relative pl-2 ${
                    payment === "sber"
                      ? "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-2 before:bg-[#15ff00]"
                      : "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-2 before:bg-[#e1ff00]"
                  }`}
                >
                  {payment === "sber" ? "СберБанк" : "Т — банк"}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <div>
              <button
                className={`px-5 py-3 ${actionColor} text-black font-bold rounded-full hover:opacity-90 transition shadow-lg`}
              >
                {actionText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-16">
        {offers.map((offer, index) => (
          <div key={index} className="flex flex-col gap-4">
            {/* Maker Info */}
            <div>
              <div className="text-base font-bold mb-2">{offer.maker}</div>
              <div className="flex gap-4 text-sm">
                <span>Транзакции {offer.transactions.toLocaleString()}</span>
                <span>Исполнено ордеров: {offer.completion}%</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-sm font-semibold">{offer.price}</div>

            {/* Limits */}
            <div className="flex gap-4 text-sm font-semibold">
              <span>{offer.available}</span>
              <span>{offer.limit}</span>
            </div>

            {/* Payment Methods */}
            <div className="flex gap-6 ml-2">
              {offer.payments.map((payment, i) => (
                <span
                  key={i}
                  className={`text-sm font-semibold relative pl-2 ${
                    payment === "sber"
                      ? "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-2 before:bg-[#15ff00]"
                      : "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-2 before:bg-[#e1ff00]"
                  }`}
                >
                  {payment === "sber" ? "СберБанк" : "Т — банк"}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <button
              className={`w-[184px] px-7 py-2 ${actionColor} text-black font-bold rounded hover:opacity-90 transition shadow-lg`}
            >
              {actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

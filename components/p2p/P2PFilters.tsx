"use client";

import { useState } from "react";
import Image from "next/image";

export default function P2PFilters() {
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("Все способы оплаты");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const cryptos = [
    { value: "USDT", icon: "/p2p-page/images-p2p/usdt-logo.svg" },
    { value: "ETH", icon: "/p2p-page/images-p2p/eth-logo.svg" },
    { value: "BTC", icon: "/p2p-page/images-p2p/btc-logo.svg" },
  ];

  const currencies = [
    { value: "USDT", flag: "/p2p-page/images-p2p/usa-logo.svg" },
    { value: "RUB", flag: "/p2p-page/images-p2p/rus-logo.svg" },
  ];

  const payments = ["Все способы оплаты", "T-Банк", "Сбербанк"];

  return (
    <div className="flex flex-wrap gap-5 justify-between items-center mb-11">
      <div className="flex flex-wrap gap-5">
        {/* Crypto Select */}
        <div className="relative">
          <button
            onClick={() => setIsCryptoOpen(!isCryptoOpen)}
            className="flex items-center gap-2 bg-white text-black rounded-lg px-4 py-2 font-bold min-w-[110px]"
          >
            <Image
              src={cryptos.find(c => c.value === selectedCrypto)?.icon || cryptos[0].icon}
              alt={selectedCrypto}
              width={21}
              height={21}
            />
            {selectedCrypto}
            <svg
              className={`w-3 h-3 ml-auto transition-transform ${isCryptoOpen ? "rotate-180" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {isCryptoOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-10">
              {cryptos.map((crypto) => (
                <button
                  key={crypto.value}
                  onClick={() => {
                    setSelectedCrypto(crypto.value);
                    setIsCryptoOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-black font-bold hover:bg-gray-100"
                >
                  <Image src={crypto.icon} alt={crypto.value} width={21} height={21} />
                  {crypto.value}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currency Box */}
        <div className="flex items-center bg-white rounded-lg px-5 py-1 gap-2">
          <input
            type="number"
            placeholder="0,00"
            className="w-20 border-none outline-none text-gray-600"
          />
          <div className="relative">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-2 text-black font-bold"
            >
              <Image
                src={currencies.find(c => c.value === selectedCurrency)?.flag || currencies[0].flag}
                alt={selectedCurrency}
                width={20}
                height={20}
                className="rounded-full"
              />
              {selectedCurrency}
              <svg
                className={`w-3 h-3 transition-transform ${isCurrencyOpen ? "rotate-180" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isCurrencyOpen && (
              <div className="absolute top-full mt-2 w-28 bg-white rounded-lg shadow-lg z-10">
                {currencies.map((currency) => (
                  <button
                    key={currency.value}
                    onClick={() => {
                      setSelectedCurrency(currency.value);
                      setIsCurrencyOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-black font-semibold hover:bg-gray-100"
                  >
                    <Image src={currency.flag} alt={currency.value} width={20} height={20} className="rounded-full" />
                    {currency.value}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Select */}
        <div className="relative min-w-[260px]">
          <button
            onClick={() => setIsPaymentOpen(!isPaymentOpen)}
            className="flex items-center justify-between w-full bg-white text-black rounded-lg px-4 py-2 font-bold"
          >
            <span>{selectedPayment}</span>
            <div className={`w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs transition-transform ${isPaymentOpen ? "rotate-180" : ""}`}>
              ✕
            </div>
          </button>
          {isPaymentOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-10">
              {payments.map((payment, index) => (
                <button
                  key={payment}
                  onClick={() => {
                    setSelectedPayment(payment);
                    setIsPaymentOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-black font-semibold hover:bg-gray-100 relative ${
                    index === 1 ? "before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-3 before:bg-[#f6ff00]" :
                    index === 2 ? "before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-3 before:bg-[#15ff00]" : ""
                  }`}
                >
                  {payment}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="px-5 py-3 bg-white text-black font-bold rounded-full hover:opacity-90 transition">
        Создать
      </button>
    </div>
  );
}

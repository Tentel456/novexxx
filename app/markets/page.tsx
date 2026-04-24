"use client";

import { useState, useEffect, useRef } from "react";
import P2PHeader from "@/components/layout/P2PHeader";

interface MarketData {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
  prevPrice?: string; // Для анимации изменения цены
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("USDT");
  const [sortBy, setSortBy] = useState<"volume" | "change" | "price">("volume");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetchMarkets();
    
    // Подключаем WebSocket для обновлений в реальном времени
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    filterAndSortMarkets();
  }, [markets, searchQuery, selectedQuote, sortBy, sortOrder]);

  const connectWebSocket = () => {
    // Binance WebSocket для всех тикеров
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Обновляем цены в реальном времени
        setMarkets(prevMarkets => {
          const updatedMarkets = [...prevMarkets];
          
          data.forEach((ticker: any) => {
            const index = updatedMarkets.findIndex(m => m.symbol === ticker.s);
            if (index !== -1) {
              const market = updatedMarkets[index];
              const newPrice = parseFloat(ticker.c).toFixed(market.quoteAsset === "USDT" ? 2 : 8);
              
              updatedMarkets[index] = {
                ...market,
                prevPrice: market.lastPrice, // Сохраняем предыдущую цену для анимации
                lastPrice: newPrice,
                priceChange: ticker.p,
                priceChangePercent: parseFloat(ticker.P).toFixed(2),
                volume: parseFloat(ticker.v).toFixed(2),
                quoteVolume: parseFloat(ticker.q).toFixed(2),
                highPrice: ticker.h,
                lowPrice: ticker.l,
              };
            }
          });
          
          return updatedMarkets;
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      // Переподключаемся через 3 секунды
      setTimeout(connectWebSocket, 3000);
    };

    wsRef.current = ws;
  };

  const fetchMarkets = async () => {
    try {
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await response.json();
      
      const formattedData: MarketData[] = data
        .filter((item: any) => item.symbol.endsWith("USDT") || item.symbol.endsWith("BTC") || item.symbol.endsWith("ETH"))
        .map((item: any) => {
          const baseAsset = item.symbol.replace(/USDT|BTC|ETH$/, "");
          const quoteAsset = item.symbol.endsWith("USDT") ? "USDT" : item.symbol.endsWith("BTC") ? "BTC" : "ETH";
          
          return {
            symbol: item.symbol,
            baseAsset,
            quoteAsset,
            lastPrice: parseFloat(item.lastPrice).toFixed(quoteAsset === "USDT" ? 2 : 8),
            priceChange: item.priceChange,
            priceChangePercent: parseFloat(item.priceChangePercent).toFixed(2),
            volume: parseFloat(item.volume).toFixed(2),
            quoteVolume: parseFloat(item.quoteVolume).toFixed(2),
            highPrice: item.highPrice,
            lowPrice: item.lowPrice,
          };
        })
        // Сортируем по капитализации (объему) по умолчанию
        .sort((a: MarketData, b: MarketData) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

      setMarkets(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching markets:", error);
      setLoading(false);
    }
  };

  const filterAndSortMarkets = () => {
    let filtered = markets.filter(
      (market) =>
        market.quoteAsset === selectedQuote &&
        (market.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
          market.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Сортировка
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "volume":
          aValue = parseFloat(a.quoteVolume);
          bValue = parseFloat(b.quoteVolume);
          break;
        case "change":
          aValue = parseFloat(a.priceChangePercent);
          bValue = parseFloat(b.priceChangePercent);
          break;
        case "price":
          aValue = parseFloat(a.lastPrice);
          bValue = parseFloat(b.lastPrice);
          break;
        default:
          return 0;
      }

      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });

    setFilteredMarkets(filtered);
  };

  const handleSort = (column: "volume" | "change" | "price") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  // Определяем класс анимации для изменения цены
  const getPriceChangeClass = (market: MarketData) => {
    if (!market.prevPrice) return "";
    const current = parseFloat(market.lastPrice);
    const prev = parseFloat(market.prevPrice);
    if (current > prev) return "price-up";
    if (current < prev) return "price-down";
    return "";
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <P2PHeader />
      
      <style jsx>{`
        @keyframes priceUp {
          0% { background-color: rgba(14, 203, 129, 0.2); }
          100% { background-color: transparent; }
        }
        @keyframes priceDown {
          0% { background-color: rgba(246, 70, 93, 0.2); }
          100% { background-color: transparent; }
        }
        .price-up {
          animation: priceUp 0.5s ease-out;
        }
        .price-down {
          animation: priceDown 0.5s ease-out;
        }
      `}</style>
      
      <div className="container max-w-[1550px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1e2329] mb-1">Рынки спот</h1>
            <p className="text-[#707a8a] text-sm">Торговые пары и цены в реальном времени</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#707a8a]">
            <div className="w-2 h-2 rounded-full bg-[#0ecb81] animate-pulse"></div>
            <span>Обновление в реальном времени</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Поиск пары..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#fafafa] text-[#1e2329] rounded-lg border border-[#eaecef] focus:outline-none focus:border-[#2b6aff] text-sm"
              />
            </div>

            {/* Quote Currency Tabs */}
            <div className="flex gap-1 bg-[#fafafa] rounded-lg p-1">
              {["USDT", "BTC", "ETH"].map((quote) => (
                <button
                  key={quote}
                  onClick={() => setSelectedQuote(quote)}
                  className={`px-5 py-1.5 rounded-md font-semibold text-sm transition ${
                    selectedQuote === quote
                      ? "bg-white text-[#1e2329] shadow-sm"
                      : "text-[#707a8a] hover:text-[#1e2329]"
                  }`}
                >
                  {quote}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSort("volume")}
                className={`px-3 py-1.5 rounded-md font-medium text-sm transition ${
                  sortBy === "volume"
                    ? "bg-[#2b6aff] text-white"
                    : "bg-[#fafafa] text-[#707a8a] hover:text-[#1e2329] border border-[#eaecef]"
                }`}
              >
                Объем {sortBy === "volume" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
              <button
                onClick={() => handleSort("change")}
                className={`px-3 py-1.5 rounded-md font-medium text-sm transition ${
                  sortBy === "change"
                    ? "bg-[#2b6aff] text-white"
                    : "bg-[#fafafa] text-[#707a8a] hover:text-[#1e2329] border border-[#eaecef]"
                }`}
              >
                Изменение {sortBy === "change" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
            </div>
          </div>
        </div>

        {/* Markets Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2b6aff]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#eaecef] bg-[#fafafa]">
                    <th className="text-left px-4 py-3 text-[#707a8a] font-semibold text-xs uppercase">Пара</th>
                    <th className="text-right px-4 py-3 text-[#707a8a] font-semibold text-xs uppercase cursor-pointer hover:text-[#1e2329]" onClick={() => handleSort("price")}>
                      Цена {sortBy === "price" && (sortOrder === "desc" ? "↓" : "↑")}
                    </th>
                    <th className="text-right px-4 py-3 text-[#707a8a] font-semibold text-xs uppercase cursor-pointer hover:text-[#1e2329]" onClick={() => handleSort("change")}>
                      Изменение 24ч {sortBy === "change" && (sortOrder === "desc" ? "↓" : "↑")}
                    </th>
                    <th className="text-right px-4 py-3 text-[#707a8a] font-semibold text-xs uppercase">Макс 24ч</th>
                    <th className="text-right px-4 py-3 text-[#707a8a] font-semibold text-xs uppercase">Мин 24ч</th>
                    <th className="text-right px-4 py-3 text-[#707a8a] font-semibold text-xs uppercase cursor-pointer hover:text-[#1e2329]" onClick={() => handleSort("volume")}>
                      Объем 24ч {sortBy === "volume" && (sortOrder === "desc" ? "↓" : "↑")}
                    </th>
                    <th className="text-center px-4 py-3 text-[#707a8a] font-semibold text-xs uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarkets.map((market) => (
                    <tr
                      key={market.symbol}
                      className="border-b border-[#eaecef] hover:bg-[#fafafa] transition cursor-pointer"
                      onClick={() => window.location.href = `/trade/${market.symbol}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-[#eaecef] flex items-center justify-center flex-shrink-0">
                            <img 
                              src={`https://cryptologos.cc/logos/${market.baseAsset.toLowerCase()}-${market.baseAsset.toLowerCase()}-logo.png`}
                              alt={market.baseAsset}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e) => {
                                // Fallback к CoinGecko API если первый источник не работает
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('coingecko')) {
                                  target.src = `https://assets.coingecko.com/coins/images/1/small/${market.baseAsset.toLowerCase()}.png`;
                                } else {
                                  // Если и CoinGecko не работает, показываем градиент с буквами
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.className = 'w-7 h-7 rounded-full bg-gradient-to-br from-[#2b6aff] to-[#1f5ae6] flex items-center justify-center text-white font-bold text-xs';
                                    parent.innerHTML = market.baseAsset.substring(0, 2);
                                  }
                                }
                              }}
                            />
                          </div>
                          <div>
                            <div className="text-[#1e2329] font-semibold text-sm">{market.baseAsset}</div>
                            <div className="text-[#707a8a] text-xs">{market.baseAsset}/{market.quoteAsset}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className={`text-[#1e2329] font-semibold text-sm ${getPriceChangeClass(market)}`}>
                          ${market.lastPrice}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div
                          className={`font-semibold text-sm ${
                            parseFloat(market.priceChangePercent) >= 0
                              ? "text-[#0ecb81]"
                              : "text-[#f6465d]"
                          }`}
                        >
                          {parseFloat(market.priceChangePercent) >= 0 ? "+" : ""}
                          {market.priceChangePercent}%
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[#707a8a] text-sm">${parseFloat(market.highPrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-[#707a8a] text-sm">${parseFloat(market.lowPrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-[#1e2329] font-medium text-sm">{formatVolume(market.quoteVolume)}</div>
                        <div className="text-[#707a8a] text-xs">{market.quoteAsset}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button className="px-3 py-1.5 bg-[#0ecb81] hover:bg-[#0bb871] text-white rounded-md font-medium text-xs transition">
                            Купить
                          </button>
                          <button className="px-3 py-1.5 bg-[#f6465d] hover:bg-[#e63950] text-white rounded-md font-medium text-xs transition">
                            Продать
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredMarkets.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#707a8a]">Торговые пары не найдены</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-[#707a8a] text-xs">
          <div>
            Показано {filteredMarkets.length} из {markets.filter(m => m.quoteAsset === selectedQuote).length} торговых пар
          </div>
          <div className="text-[#707a8a] text-xs">
            Сортировка по капитализации (объем торгов 24ч)
          </div>
        </div>
      </div>
    </div>
  );
}

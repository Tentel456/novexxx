"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import P2PHeader from "@/components/layout/P2PHeader";
import CandlestickChart from "@/components/CandlestickChart";
import Link from "next/link";

interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
}

interface Trade {
  price: string;
  amount: string;
  time: string;
  isBuy: boolean;
}

interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export default function TradePage() {
  const params = useParams();
  const symbol = (params?.symbol as string) || 'BTCUSDT';
  const [ticker, setTicker] = useState<TickerData | null>(null);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const baseAsset = symbol.replace(/USDT|BTC|ETH$/, "");
  const quoteAsset = symbol.endsWith("USDT") ? "USDT" : symbol.endsWith("BTC") ? "BTC" : "ETH";

  useEffect(() => {
    fetchTicker();
    fetchOrderBook();
    fetchRecentTrades();
    connectWebSocket();

    // Load TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: '15',
          timezone: 'Europe/Moscow',
          theme: 'light',
          style: '1',
          locale: 'ru',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
          studies: [],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650'
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      // Clean up script
      const scripts = document.querySelectorAll('script[src="https://s3.tradingview.com/tv.js"]');
      scripts.forEach(s => s.remove());
    };
  }, [symbol]);

  const fetchTicker = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const data = await response.json();
      setTicker({
        symbol: data.symbol,
        lastPrice: parseFloat(data.lastPrice).toFixed(2),
        priceChange: data.priceChange,
        priceChangePercent: parseFloat(data.priceChangePercent).toFixed(2),
        highPrice: parseFloat(data.highPrice).toFixed(2),
        lowPrice: parseFloat(data.lowPrice).toFixed(2),
        volume: parseFloat(data.volume).toFixed(2),
        quoteVolume: parseFloat(data.quoteVolume).toFixed(2),
      });
      setPrice(parseFloat(data.lastPrice).toFixed(2));
    } catch (error) {
      console.error('Error fetching ticker:', error);
    }
  };

  const fetchOrderBook = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=20`);
      const data = await response.json();
      
      const bids = data.bids.slice(0, 15).map((bid: string[]) => ({
        price: parseFloat(bid[0]).toFixed(2),
        amount: parseFloat(bid[1]).toFixed(4),
        total: (parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(2),
      }));

      const asks = data.asks.slice(0, 15).map((ask: string[]) => ({
        price: parseFloat(ask[0]).toFixed(2),
        amount: parseFloat(ask[1]).toFixed(4),
        total: (parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(2),
      }));

      setOrderBook({ bids, asks });
    } catch (error) {
      console.error('Error fetching order book:', error);
    }
  };

  const fetchRecentTrades = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=30`);
      const data = await response.json();
      
      const trades = data.map((trade: any) => ({
        price: parseFloat(trade.price).toFixed(2),
        amount: parseFloat(trade.qty).toFixed(4),
        time: new Date(trade.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isBuy: trade.isBuyerMaker === false,
      }));

      setRecentTrades(trades);
    } catch (error) {
      console.error('Error fetching recent trades:', error);
    }
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTicker(prev => prev ? {
        ...prev,
        lastPrice: parseFloat(data.c).toFixed(2),
        priceChangePercent: parseFloat(data.P).toFixed(2),
        highPrice: parseFloat(data.h).toFixed(2),
        lowPrice: parseFloat(data.l).toFixed(2),
        volume: parseFloat(data.v).toFixed(2),
        quoteVolume: parseFloat(data.q).toFixed(2),
      } : null);
    };

    wsRef.current = ws;
  };

  const handleTrade = () => {
    alert(`${side === 'buy' ? 'Покупка' : 'Продажа'} ${amount} ${baseAsset} по ${orderType === 'limit' ? price : 'рыночной'} цене`);
  };

  const total = orderType === 'limit' && price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(2) : '0.00';

  if (!ticker) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2b6aff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <P2PHeader />
      
      <div className="container max-w-[1920px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-[#707a8a]">
          <Link href="/markets" className="hover:text-[#2b6aff]">Рынки</Link>
          <span>/</span>
          <span className="text-[#1e2329] font-semibold">{baseAsset}/{quoteAsset}</span>
        </div>

        {/* Ticker Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-[#eaecef] flex items-center justify-center">
                  <img 
                    src={`https://cryptologos.cc/logos/${baseAsset.toLowerCase()}-${baseAsset.toLowerCase()}-logo.png`}
                    alt={baseAsset}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://assets.coingecko.com/coins/images/1/small/${baseAsset.toLowerCase()}.png`;
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#1e2329]">{baseAsset}/{quoteAsset}</h1>
                  <p className="text-xs text-[#707a8a]">{baseAsset}</p>
                </div>
              </div>
              
              <div className="h-10 w-px bg-[#eaecef]"></div>
              
              <div>
                <div className="text-2xl font-bold text-[#1e2329]">${ticker.lastPrice}</div>
                <div className={`text-sm font-semibold ${parseFloat(ticker.priceChangePercent) >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                  {parseFloat(ticker.priceChangePercent) >= 0 ? '+' : ''}{ticker.priceChangePercent}%
                </div>
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <div className="text-[#707a8a] mb-1">24ч Макс</div>
                <div className="text-[#1e2329] font-semibold">${ticker.highPrice}</div>
              </div>
              <div>
                <div className="text-[#707a8a] mb-1">24ч Мин</div>
                <div className="text-[#1e2329] font-semibold">${ticker.lowPrice}</div>
              </div>
              <div>
                <div className="text-[#707a8a] mb-1">Объем 24ч ({baseAsset})</div>
                <div className="text-[#1e2329] font-semibold">{parseFloat(ticker.volume).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[#707a8a] mb-1">Объем 24ч ({quoteAsset})</div>
                <div className="text-[#1e2329] font-semibold">${parseFloat(ticker.quoteVolume).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left: Chart */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: '600px' }}>
              <CandlestickChart symbol={symbol} />
            </div>
          </div>

          {/* Right: Order Form */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {/* Buy/Sell Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSide('buy')}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
                    side === 'buy' ? 'bg-[#0ecb81] text-white' : 'bg-[#fafafa] text-[#707a8a]'
                  }`}
                >
                  Купить
                </button>
                <button
                  onClick={() => setSide('sell')}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
                    side === 'sell' ? 'bg-[#f6465d] text-white' : 'bg-[#fafafa] text-[#707a8a]'
                  }`}
                >
                  Продать
                </button>
              </div>

              {/* Order Type */}
              <div className="flex gap-2 mb-4 text-sm">
                <button
                  onClick={() => setOrderType('limit')}
                  className={`px-3 py-1 rounded ${orderType === 'limit' ? 'bg-[#2b6aff] text-white' : 'text-[#707a8a]'}`}
                >
                  Лимит
                </button>
                <button
                  onClick={() => setOrderType('market')}
                  className={`px-3 py-1 rounded ${orderType === 'market' ? 'bg-[#2b6aff] text-white' : 'text-[#707a8a]'}`}
                >
                  Рынок
                </button>
              </div>

              {/* Price Input */}
              {orderType === 'limit' && (
                <div className="mb-3">
                  <label className="text-xs text-[#707a8a] mb-1 block">Цена</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fafafa] border border-[#eaecef] rounded-lg text-sm focus:outline-none focus:border-[#2b6aff]"
                    placeholder="0.00"
                  />
                  <div className="text-xs text-[#707a8a] mt-1">{quoteAsset}</div>
                </div>
              )}

              {/* Amount Input */}
              <div className="mb-3">
                <label className="text-xs text-[#707a8a] mb-1 block">Количество</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fafafa] border border-[#eaecef] rounded-lg text-sm focus:outline-none focus:border-[#2b6aff]"
                  placeholder="0.00"
                />
                <div className="text-xs text-[#707a8a] mt-1">{baseAsset}</div>
              </div>

              {/* Percentage Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <button
                    key={percent}
                    className="py-1 text-xs bg-[#fafafa] hover:bg-[#eaecef] rounded transition"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              {/* Total */}
              {orderType === 'limit' && (
                <div className="mb-4 p-3 bg-[#fafafa] rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#707a8a]">Итого</span>
                    <span className="text-[#1e2329] font-semibold">{total} {quoteAsset}</span>
                  </div>
                </div>
              )}

              {/* Trade Button */}
              <button
                onClick={handleTrade}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  side === 'buy' ? 'bg-[#0ecb81] hover:bg-[#0bb871]' : 'bg-[#f6465d] hover:bg-[#e63950]'
                }`}
              >
                {side === 'buy' ? 'Купить' : 'Продать'} {baseAsset}
              </button>

              {/* Balance Info */}
              <div className="mt-4 pt-4 border-t border-[#eaecef] text-xs text-[#707a8a]">
                <div className="flex justify-between mb-2">
                  <span>Доступно</span>
                  <span className="text-[#1e2329]">0.00 {side === 'buy' ? quoteAsset : baseAsset}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Book */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-[#1e2329] mb-3">Стакан ордеров</h3>
              
              {/* Asks (Sell Orders) */}
              <div className="mb-2">
                {orderBook.asks.slice().reverse().map((ask, index) => (
                  <div key={index} className="flex justify-between text-xs py-0.5 hover:bg-[#fafafa]">
                    <span className="text-[#f6465d] font-medium">{ask.price}</span>
                    <span className="text-[#707a8a]">{ask.amount}</span>
                    <span className="text-[#707a8a]">{ask.total}</span>
                  </div>
                ))}
              </div>

              {/* Current Price */}
              <div className={`text-center py-2 my-2 font-bold text-lg ${parseFloat(ticker.priceChangePercent) >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {ticker.lastPrice}
              </div>

              {/* Bids (Buy Orders) */}
              <div>
                {orderBook.bids.map((bid, index) => (
                  <div key={index} className="flex justify-between text-xs py-0.5 hover:bg-[#fafafa]">
                    <span className="text-[#0ecb81] font-medium">{bid.price}</span>
                    <span className="text-[#707a8a]">{bid.amount}</span>
                    <span className="text-[#707a8a]">{bid.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-[#1e2329] mb-3">Последние сделки</h3>
              <div className="space-y-1">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex justify-between text-xs hover:bg-[#fafafa] py-0.5">
                    <span className={trade.isBuy ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>{trade.price}</span>
                    <span className="text-[#707a8a]">{trade.amount}</span>
                    <span className="text-[#707a8a]">{trade.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Info */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-[#1e2329] mb-3">Информация о рынке</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#707a8a]">Изменение 24ч</span>
                  <span className={parseFloat(ticker.priceChangePercent) >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>
                    {ticker.priceChangePercent}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707a8a]">Максимум 24ч</span>
                  <span className="text-[#1e2329]">${ticker.highPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707a8a]">Минимум 24ч</span>
                  <span className="text-[#1e2329]">${ticker.lowPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707a8a]">Объем 24ч</span>
                  <span className="text-[#1e2329]">{parseFloat(ticker.volume).toLocaleString()} {baseAsset}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

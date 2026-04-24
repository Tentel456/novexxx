"use client";

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface CandlestickChartProps {
  symbol: string;
}

export default function CandlestickChart({ symbol }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Создаем график
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#1e2329',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      crosshair: {
        mode: 1,
      },
    });

    // Создаем серию свечей
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderUpColor: '#0ecb81',
      borderDownColor: '#f6465d',
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Загружаем данные
    fetchKlines();

    // Обработчик изменения размера
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol]);

  const fetchKlines = async () => {
    try {
      console.log('Fetching klines for', symbol);
      // Получаем свечи за последние 24 часа (интервал 15 минут)
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=100`
      );
      const data = await response.json();

      console.log('Received klines data:', data.length, 'candles');

      const candles = data.map((kline: any[]) => ({
        time: Math.floor(kline[0] / 1000), // Конвертируем в секунды
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
      }));

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(candles);
        console.log('Chart data set successfully');
      }

      // Подключаем WebSocket для обновлений в реальном времени
      connectWebSocket();
    } catch (error) {
      console.error('Error fetching klines:', error);
    }
  };

  const connectWebSocket = () => {
    // Закрываем предыдущее соединение если есть
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_15m`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected for', symbol);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const kline = data.k;

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.update({
          time: Math.floor(kline.t / 1000),
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  return (
    <div className="w-full h-full">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}

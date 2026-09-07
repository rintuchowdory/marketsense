# MarketSense — AI Trading OS

An open-source, 1:1 clone of the [MarketSense](https://tradexau.base44.app/) AI trading dashboard — an educational trading interface that visualizes market sentiment, technical signals, and news-driven analysis.

> 🎓 **For Educational & Visual Simulation Purposes Only — not financial advice, no real trades are placed.**

![Dashboard](https://img.shields.io/badge/dashboard-dark%20UI-0a0e17?style=flat-square)

## What's inside

- **Live ticker tape** — scrolling marquee of BTC/USD, XAU/USD, AAPL, US30
- **Asset cards** — price, 24h change, sparklines for 4 instruments
- **Technical panel** — RSI(14), MA20, MA50, MA Cross (Golden/Death) computed from the chart series
- **Price & Signal chart** — area/candlestick view, 15m → 1M timeframes, MA-crossover buy/sell markers (powered by [lightweight-charts](https://github.com/tradingview/lightweight-charts))
- **Signal breakdown** — "AI verdict" (BUY / SELL / HOLD) with fundamental, technical, and risk narratives
- **Sentiment meter** — gauge blending news sentiment + RSI
- **Live feed** — filterable news & social stream with BULLISH / BEARISH / NEUTRAL tags
- **Auto refresh** — 20-second countdown that nudges the simulated feed

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Demo without installing

Open [`preview-single.html`](./preview-single.html) directly in any browser — it's the full production build inlined into a single file.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lightweight-charts](https://github.com/tradingview/lightweight-charts) (TradingView)
- [lucide-react](https://lucide.dev/) icons

## Project structure

```
src/
  App.tsx                    # dashboard wiring & layout
  components/                # Header, TickerTape, AssetCard, PriceChart,
                             # SentimentGauge, SignalBreakdown, LiveFeed, ...
  hooks/useMarketData.ts     # simulated feed + 20s auto-refresh
  lib/market.ts              # candle generation, RSI, SMA, signal detection
  lib/news.ts                # news & social feed data
```

## Notes on data

Prices, candles, and news in this repo are **simulated** — a deterministic random walk seeded per symbol, echoing the "delayed public market feed" behavior of the original app. No real market data is fetched and no trades are placed. To make it live, swap `lib/market.ts` for a real API (e.g. Binance, Alpha Vantage) — the component contracts stay the same.

## License

MIT — see [LICENSE](./LICENSE).

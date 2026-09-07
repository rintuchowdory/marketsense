import { useMemo, useState } from "react";
import DisclaimerBanner from "./components/DisclaimerBanner";
import Header from "./components/Header";
import TickerTape from "./components/TickerTape";
import StatusBar from "./components/StatusBar";
import AssetCard from "./components/AssetCard";
import MainAssetPanel from "./components/MainAssetPanel";
import PriceChart from "./components/PriceChart";
import SignalBreakdown from "./components/SignalBreakdown";
import SentimentGauge from "./components/SentimentGauge";
import LiveFeed from "./components/LiveFeed";
import Footer from "./components/Footer";
import ComingSoon from "./components/ComingSoon";
import { useMarketData } from "./hooks/useMarketData";
import { ASSETS, detectSignals, pctChange, rsi, sma, verdictFromState, type AssetSymbol } from "./lib/market";
import { NEWS_FEED } from "./lib/news";

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selected, setSelected] = useState<AssetSymbol>("BTCUSD");
  const [timeframe, setTimeframe] = useState("1D");

  const { liveHistories, chartHistory, countdown } = useMarketData(selected, timeframe);

  const tickerData = ASSETS.map((asset) => {
    const history = liveHistories.get(asset.symbol) ?? [];
    const price = history.length ? history[history.length - 1].close : asset.basePrice;
    const change = pctChange(history);
    return { asset, price, change };
  });

  const selectedAsset = ASSETS.find((a) => a.symbol === selected)!;
  const selectedPrice = chartHistory.length ? chartHistory[chartHistory.length - 1].close : selectedAsset.basePrice;
  const selectedChange = pctChange(chartHistory);
  const rsiValue = rsi(chartHistory);
  const ma20 = sma(chartHistory, 20);
  const ma50 = sma(chartHistory, 50);
  const signals = useMemo(() => detectSignals(chartHistory), [chartHistory]);

  const sentimentScore = useMemo(() => {
    const weights: Record<string, number> = { BULLISH: 1, BEARISH: -1, NEUTRAL: 0 };
    const avg = NEWS_FEED.reduce((sum, n) => sum + weights[n.sentiment], 0) / NEWS_FEED.length;
    return Math.round(50 + avg * 35 + (rsiValue - 50) * 0.3);
  }, [rsiValue]);

  const verdict = verdictFromState(rsiValue, ma20 >= ma50 ? "golden" : "death", sentimentScore);

  const fundamentalText = `Recent headlines show a tug-of-war between macro concerns and steady institutional flows into ${selectedAsset.name}. This mixed backdrop suggests price is currently being driven more by broad market sentiment than by any single catalyst.`;
  const technicalText = `With RSI at ${rsiValue.toFixed(1)}, ${selectedAsset.label} is ${
    rsiValue > 70 ? "in overbought territory" : rsiValue < 30 ? "in oversold territory" : "in a neutral zone, lacking clear overbought or oversold momentum"
  }. Price is currently ${selectedPrice >= ma20 ? "above" : "below"} its MA20 ($${ma20.toFixed(2)}) and ${
    selectedPrice >= ma50 ? "above" : "below"
  } its MA50 ($${ma50.toFixed(2)}), pointing to a ${ma20 >= ma50 ? "constructive" : "cautious"} short-term structure.`;
  const riskText = `News-driven signals can lead to "fake outs" as traders overreact to short-term headlines that contradict the longer-term trend. Always manage risk with stop-loss orders and wait for confirmation before entering a new position.`;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <DisclaimerBanner />
      <Header active={activeTab} onChange={setActiveTab} />
      <TickerTape data={tickerData} />
      <StatusBar countdown={countdown} />

      <main className="flex-1 px-4 sm:px-6 pb-8">
        {activeTab !== "Dashboard" ? (
          <ComingSoon tab={activeTab} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {ASSETS.map((asset) => {
                const history = liveHistories.get(asset.symbol) ?? [];
                const price = history.length ? history[history.length - 1].close : asset.basePrice;
                const change = pctChange(history);
                return (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    price={price}
                    change={change}
                    spark={history.map((c) => c.close)}
                    selected={selected === asset.symbol}
                    onClick={() => setSelected(asset.symbol)}
                  />
                );
              })}
            </div>

            <MainAssetPanel
              asset={selectedAsset}
              price={selectedPrice}
              change={selectedChange}
              rsiValue={rsiValue}
              ma20={ma20}
              ma50={ma50}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
              <div className="min-h-[420px]">
                <PriceChart candles={chartHistory} signals={signals} timeframe={timeframe} onTimeframe={setTimeframe} />
              </div>
              <SentimentGauge value={sentimentScore} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
              <SignalBreakdown verdict={verdict} fundamental={fundamentalText} technical={technicalText} risk={riskText} />
              <LiveFeed />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

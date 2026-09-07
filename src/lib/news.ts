export type Sentiment = "BULLISH" | "BEARISH" | "NEUTRAL";

export interface NewsItem {
  id: string;
  source: string;
  handle?: string;
  hoursAgo: number;
  sentiment: Sentiment;
  text: string;
  kind: "headline" | "social";
}

export const NEWS_FEED: NewsItem[] = [
  {
    id: "n1",
    source: "CoinMarketCap",
    hoursAgo: 20,
    sentiment: "BEARISH",
    text: "Bitcoin Falls Below $80K as Hot Jobs Report Revives Fed Hike Bets",
    kind: "headline",
  },
  {
    id: "n2",
    source: "CoinMarketCap",
    hoursAgo: 26,
    sentiment: "NEUTRAL",
    text: "Is the Bitcoin Bull Market Back? Investors Bet on 'Higher for Longer' Rates",
    kind: "headline",
  },
  {
    id: "n3",
    source: "Yahoo Finance",
    hoursAgo: 27,
    sentiment: "BULLISH",
    text: "Crypto stages major rally on rate hopes",
    kind: "headline",
  },
  {
    id: "n4",
    source: "CoinMarketCap",
    hoursAgo: 30,
    sentiment: "BULLISH",
    text: "Bitcoin ETFs Post $3.8B 3-Week Inflow Streak, Strongest Run of 2026",
    kind: "headline",
  },
  {
    id: "n5",
    source: "CoinMarketCap",
    hoursAgo: 46,
    sentiment: "NEUTRAL",
    text: "Ancient Bitcoin Wallets Move Again as Summer Awakening Continues",
    kind: "headline",
  },
  {
    id: "n6",
    source: "Forex.com",
    hoursAgo: 101,
    sentiment: "BEARISH",
    text: "Bitcoin Price Forecast: BTC/USD 3-Week Selloff Nears Major Support Test",
    kind: "headline",
  },
  {
    id: "n7",
    source: "Marcus Thorne",
    handle: "@MacroStrategist",
    hoursAgo: 481,
    sentiment: "NEUTRAL",
    text: "BTC hovering near the mid-70s with RSI cooling off. Pure consolidation — waiting for a clear catalyst to break the current stagnation. Neutral stance until volume picks up.",
    kind: "social",
  },
  {
    id: "n8",
    source: "Elena Vance",
    handle: "@MarketPulse",
    hoursAgo: 481,
    sentiment: "BULLISH",
    text: "A small dip is nothing in this climate. Bitcoin is just building the base for the next leg up. Accumulate while RSI is cooling off — the trend remains strongly bullish.",
    kind: "social",
  },
  {
    id: "n9",
    source: "Samir K.",
    handle: "@CryptoFlowCap",
    hoursAgo: 481,
    sentiment: "BEARISH",
    text: "BTC stalling isn't a good look. With RSI flatlining and momentum fading, we could see a retest of lower support levels soon. Proceed with caution.",
    kind: "social",
  },
  {
    id: "n10",
    source: "Tracey D.",
    handle: "@TradeSignals",
    hoursAgo: 481,
    sentiment: "NEUTRAL",
    text: "Price action is indecisive. Market needs to clear the 50 RSI hurdle to signal fresh bullish intent. Keeping a close eye on the short-term moving averages.",
    kind: "social",
  },
];

export const NEWS_SOURCES = ["All", ...Array.from(new Set(NEWS_FEED.map((n) => n.source)))];

export function timeAgo(hoursAgo: number): string {
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  return `${Math.round(hoursAgo / 24)}d ago`;
}

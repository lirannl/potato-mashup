interface sentiment {
  polarity: number;
  type: "positive" | "negative" | "neutral";
}

interface sentence {
  sentence: string;
  sentiment: sentiment;
}

export default interface ISentiment {
  result: sentiment;
  sentences: sentence[];
}

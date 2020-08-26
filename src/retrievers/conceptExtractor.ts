import NaturalLang from "ibm-watson/natural-language-understanding/v1";
import { IamAuthenticator } from "ibm-watson/auth";

const naturalLanguageUnderstanding = new NaturalLang({
  version: "2020-08-25",
  authenticator: new IamAuthenticator({ apikey: process.env.WATSON_KEY! }),
  url: process.env.WATSON_URL,
});

const getConcepts = async (text: string) => {
  const analysisParams: NaturalLang.AnalyzeParams = {
    text: text,
    features: {
      concepts: {},
    },
  };
  try {
    return (await naturalLanguageUnderstanding.analyze(analysisParams)).result
      .concepts || null;
  } catch {
    return null;
  }
};

export default getConcepts;

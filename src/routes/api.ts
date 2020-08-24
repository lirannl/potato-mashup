import IRoute from "../interfaces/route";
import determineSentiment from "../retrievers/sentiment";
import usPatentData from "../retrievers/usPatentData";
import { usPatentParams } from "../interfaces/usPatentRespose";

const api: IRoute = async (ctx) => {
  if (!ctx.is("json"))
    ctx.throw(
      400,
      `No json provided.\nYou must provide a JSON with search parameters like patentNum, title, or assignee.`
    );
  const params = ctx.request.body as usPatentParams;
  const patents = await (await usPatentData(params)).docs.sort((doc1, doc2) => {
    if (doc1.publicationDate > doc2.publicationDate) return 1;
    if (doc1.publicationDate < doc2.publicationDate) return -1;
    return 0;
  });
  if (patents.length == 0)
    ctx.throw(400, "No patents found for the given parameters.");
  else {
    const joinedTitles = patents.map((patent) => patent.title.replace(".", "_")).join(". ").concat(".");
    const {sentences} = await determineSentiment(joinedTitles);
    ctx.response.body = patents.map((patent, index) => ({title: patent.title, date: patent.publicationDate, sentiment: sentences[index].sentiment.polarity}));
  }
};

export default api;
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
  const patents = await (await usPatentData(params)).docs;
  if (patents.length == 0)
    ctx.throw(400, "No patents found for the given parameters.");
  else {
    const inventors = patents.reduce((acc, curr)=>acc.concat(curr.inventor), [] as string[]);
    ctx.response.body = inventors;
  }
};

export default api;

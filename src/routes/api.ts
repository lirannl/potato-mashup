import IRoute from "../interfaces/route";
import usPatentData from "../retrievers/usPatentData";
import { usPatentParams, usPatentDoc } from "../interfaces/usPatentRespose";
import getTweeter from "../retrievers/twitterUsers";
import { TwitterUser } from "../interfaces/twitterUser";

/**
 * Add the inventors from the given patent result to the names list
 * @param acc Inventors list
 * @param curr Names list
 */
const accumulateInventors = (acc: string[], curr: usPatentDoc) =>
  acc.concat(curr.inventor);

/**
 * Takes an accumulator object, a new name, and returns an accumulator with that name added -
 * be it as a new property, or increasing the occurrences of an existing one.
 * @param acc Accumulator object of type {inventorName: number_of_occurrences}
 * @param inventorName The inventor's name to add to the accumulator
 */
const addOccurrence = (acc: { [name: string]: number }, inventorName: string) =>
  Object.assign(acc, { [inventorName]: (acc[inventorName] || 0) + 1 }) as {
    [name: string]: number;
  };

const compareInventorsWithOccurrence = (
  inventor1: [string, number],
  inventor2: [string, number]
) => {
  if (inventor1[1] > inventor2[1]) return -1;
  if (inventor1[1] < inventor2[1]) return 1;
  else return 0;
};

const api: IRoute = async (ctx) => {
  if (!ctx.is("json"))
    ctx.throw(
      400,
      `No json provided.\nYou must provide a JSON with search parameters like patentNum, title, or assignee.`
    );
  const params = ctx.request.body as usPatentParams;
  const patents = await usPatentData(params);
  if (patents.length == 0)
    ctx.throw(400, "No patents found for the given parameters.");
  else {
    const inventors = Object.entries(
      patents.reduce(accumulateInventors, []).reduce(addOccurrence, {})
    ).sort(compareInventorsWithOccurrence);
    const tweeters = (
      await Promise.all(
        inventors
          .slice(0, 45)
          .map(async (inventor) => await getTweeter(inventor[0])) // Look up users (only using the first result for each user)
      )
    ).reduce((acc, curr) => acc.concat(curr), []); // Flatten the 
    ctx.response.body = tweeters;
  }
};

export default api;

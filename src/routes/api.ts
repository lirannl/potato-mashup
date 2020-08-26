import IRoute from "../interfaces/route";
import usPatentData from "../retrievers/usPatentData";
import { usPatentParams, usPatentDoc } from "../interfaces/usPatentRespose";
import getTweeter from "../retrievers/twitterUsers";
import { TwitterUser } from "../interfaces/twitterUser";
import getConcepts from "../retrievers/conceptExtractor";

/**
 * Takes patent responses and puts the most frequent inventors into an array. Up to 45 by default
 * @param patents Array of patent responses
 * @param maxInventors The maximum number of inventors. 0 (or less) to return all (sorted).
 */
const getTopInventors = (patents: usPatentDoc[], maxInventors: number = 45) =>
  Object.entries(
    patents.reduce(accumulateInventors, []).reduce(addOccurrence, {})
  )
    // Sort the list based on the frequency at which inventors appear in the list
    .sort(compareInventorsWithOccurrence)
    // Only take the top 45 inventors
    .slice(0, maxInventors > 0 ? maxInventors : undefined)
    // Dispose of the frequency
    .map(([inventor]) => inventor);

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
  const patents = await usPatentData(params, 1200);
  if (patents.length == 0)
    ctx.throw(400, "No patents found for the given parameters.");
  else {
    // Create an object caching the twitter users of the top 45 inventors
    const tweeters: { [name: string]: TwitterUser | undefined } = await (
      await Promise.all(
        getTopInventors(patents, 100).map(
          async (inventor) =>
            [inventor, await getTweeter(inventor)] as [string, TwitterUser]
        )
      )
    ).reduce((acc, curr) => {
      if (!curr[1]) return acc;
      return Object.assign(acc, { [curr[0]]: curr[1] });
    }, {});
    const response = (
      await Promise.all(
        patents.map(async (patent) => {
          const TweetingInventors = patent.inventor
            .map((name) => tweeters[name])
            .filter((el) => el) as TwitterUser[]; // Remove nulls
          if (TweetingInventors.length == 0) return null;
          const concepts = await getConcepts(patent.title);
          if (!concepts) return null;
          return { inventors: TweetingInventors, concepts: concepts };
        })
      )
    ).filter((element) => element!); // Remove nulls
    ctx.response.body = response;
  }
};

export default api;

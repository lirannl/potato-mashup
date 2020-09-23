import IRoute from "../interfaces/route";
import usPatentData from "../retrievers/usPatentData";
import { usPatentParams, usPatentDoc } from "../interfaces/usPatentRespose";
import getTweeter from "../retrievers/twitterUsers";
import { TwitterUser } from "../interfaces/twitterUser";
import getConcepts from "../retrievers/conceptExtractor";

/**
 * Takes patent responses and puts the most frequent inventors into an array. Up to 45 by default
 * @param patents Array of patent responses
 * @param maxInventors The maximum number of inventors. If not supplied, all inventors will be returned.
 */
const getTopInventors = (patents: usPatentDoc[], maxInventors?: number) =>
  Object.entries(
    patents.reduce(accumulateInventors, []).reduce(addOccurrence, {})
  )
    // Sort the list based on the frequency at which inventors appear in the list
    .sort(compareInventorsWithOccurrence)
    // Only take the top inventors as specified
    .slice(0, maxInventors)
    // Dispose of the frequency
    .map((inventor) => ({ name: inventor[0], frequency: inventor[1] }));

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

/**
 * Transform the response into the right format.
 * @param response The response after having passed through all APIs
 */
export const responseTransformer = (response: ({
  inventors: {
    name: string;
    twitter_username: string | undefined;
    frequency: number | undefined;
  }[];
  concepts: string[];
})[]) => {
  return response.reduce((acc, curr) => {
    // Get the names of each inventor that is already in the accumulating list
    const duplicateInventors = curr.inventors.filter(inventor => acc.map(item => item.name).includes(inventor.name));
    // Transform the data into an association between inventors and the concepts they were involved in the invention of
    const items = curr.inventors.map(inventor => ({ name: inventor.name, twitter_username: inventor.twitter_username, frequency: inventor.frequency, concepts: curr.concepts }));
    const newItems = items.filter(item => !duplicateInventors.find(innerItem => innerItem.name == item.name));
    for (const { name } of duplicateInventors) { // For each duplicate inventor
      const existingConcepts = acc.find(item => item.name == name)!.concepts; // Get their existing concepts
      acc.find(item => item.name == name)!.concepts = existingConcepts.concat(
        curr.concepts.filter(concept => !existingConcepts.includes(concept)) // Add any new concepts which don't already exist in the list
      );
    }
    return acc.concat(newItems); // Add new items to the association list
  }, [] as { name: string, twitter_username?: string, frequency?: number, concepts: string[] }[]);
}

const api: IRoute = async (ctx) => {
  const params = ctx.request.query as usPatentParams;
  if (Object.keys(params).length == 0) {
    ctx.response.status = 400;
    ctx.response.body = "Received an empty request";
    return;
  }
  const patents = await usPatentData({assignee: params.assignee});
  if (patents.length == 0)
    ctx.throw(404, "No patents found for the given parameters.");
  else {
    const topInventors = getTopInventors(patents);
    // Create an object caching the twitter users of the top inventors
    try {
      /*const tweeters: { [name: string]: TwitterUser | undefined } = (
        await Promise.all(
          topInventors.slice(0, 300).map(
            async (inventor) => [inventor.name, await getTweeter(inventor.name)] as [string, TwitterUser]
          )
        )
      ).reduce((acc, curr) => {
        if (!curr[1])
          return acc;
        return Object.assign(acc, { [curr[0]]: curr[1] });
      }, {});*/
      const tweeters = {} as {[name: string]: {screen_name: string}};
      const response = await Promise.all(
        patents
          .slice(0, parseInt(process.env.MAX_WATSON_REQS || "200")) // Limit the amount of patents to reduce excessive IBM Watson usage
          .map(async (patent) => {
            const patentInventors = patent.inventor.map((name) => ({
              name: name,
              twitter_username: tweeters[name]?.screen_name,
              frequency: topInventors.find((inventor) => inventor.name == name)?.frequency
            }));
            const concepts = (await getConcepts(patent.title))?.map(concept => concept.text!);
            if (!concepts || concepts.length == 0) return null;
            return { inventors: patentInventors, concepts: concepts };
          })
      );
      ctx.response.body = responseTransformer(response.filter(res => res).map(res => res!));
    }
    catch (e) {
      if (e.twitterReply) {
        ctx.response.status = 500;
        ctx.response.body = e.twitterReply;
      }
      else ctx.throw(500, JSON.stringify(e.message));
    }
  }
};

export default api;

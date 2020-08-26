import Axios from "axios";
import {
  usPatentRes,
  usPatentParams,
  usPatentDoc,
} from "../interfaces/usPatentRespose";

const singleReq = async (searchPatameters: usPatentParams) => {
  return (await (
    await Axios.get(
      `https://developer.uspto.gov/ibd-api/v1/patent/application`,
      { params: searchPatameters }
    )
  ).data.response) as usPatentRes;
};

const recursivePatentRetriever: (
  searchParameters: usPatentParams,
  patents: usPatentDoc[],
  maxPatents: number
) => Promise<usPatentDoc[]> = async (searchParameters, patents, maxPatents) => {
  const newDocs = (await singleReq(searchParameters)).docs;
  if (newDocs.length == 100 && (searchParameters.start || 0) < maxPatents)
    return await recursivePatentRetriever(
      Object.assign({}, searchParameters, {
        start: (searchParameters.start || 0) + newDocs.length, // Increment the start parameter
      } as usPatentParams),
      patents.concat(newDocs),
      maxPatents
    );
  return patents.concat(newDocs);
};

/**
 * Get patents from the US patent office
 * @param searchParameters the search parameters to use for the lookup
 * @param maxPatents Fetch up until this number of patents is provided (600 by default)
 */
const getUSPatents: (
  searchParameters: usPatentParams,
  maxPatents?: number
) => Promise<usPatentDoc[]> = async (searchParameters, maxPatents = 600) => {
  
  return await recursivePatentRetriever(searchParameters, [], maxPatents);
};

export default getUSPatents;

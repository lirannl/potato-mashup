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

/**
 * Get up to the first 2000 patents
 * @param searchParameters the search parameters to use for the lookup
 * @param patents
 */
const recursivePatentRetriever: (
  searchParameters: usPatentParams,
  patents: usPatentDoc[]
) => Promise<usPatentDoc[]> = async (searchParameters, patents) => {
  const newDocs = (await singleReq(searchParameters)).docs;
  if (newDocs.length == 100 && (searchParameters.start || 0) < 600)
    return await recursivePatentRetriever(
      Object.assign({}, searchParameters, {
        start: (searchParameters.start || 0) + 100,
      } as usPatentParams),
      patents.concat(newDocs)
    );
  return patents.concat(newDocs);
};

const getUSPatents: (
  searchParameters: usPatentParams
) => Promise<usPatentDoc[]> = async (searchParameters) => {
  return await recursivePatentRetriever(searchParameters, []);
};

export default getUSPatents;

import Axios from "axios";
import {
  usPatentRes,
  usPatentParams,
  usPatentDoc,
} from "../interfaces/usPatentRespose";

/**
 * Sends a single request to the us patent office using the given params
 * @param searchPatameters 
 */
const singleReq = async (searchPatameters: usPatentParams) => {
  return (await (
    await Axios.get(
      `https://developer.uspto.gov/ibd-api/v1/patent/application`,
      { params: searchPatameters }
    )
  ).data.response) as usPatentRes;
};

/**
 * Generates an array of starting points for future querying of the US patent office
 * @param max Generate enough starting points to capture this many patents
 * @param stepSize How many patents will be recieved per API request
 * @param startPoints The accumulating array of starting points
 */
const recursiveStartPointsBuilder: (
  max: number,
  stepSize: number,
  startPoints?: number[]
) => number[] = (max, stepSize, startPoints = [stepSize]) => {
  const newStartPoints = startPoints.concat(
    startPoints.slice(-1)[0] + stepSize
  );
  if (newStartPoints.slice(-1)[0] > max) return startPoints;
  return recursiveStartPointsBuilder(max, stepSize, newStartPoints);
};

/**
 * Get patents from the US patent office
 * @param searchParameters the search parameters to use for the lookup
 * @param maxPatents Fetch up until this number of patents (if provided)
 */
const usPatentData: (
  searchParameters: usPatentParams,
  maxPatents?: number
) => Promise<usPatentDoc[]> = async (searchParameters, maxPatents) => {
  const FirstPatentsRes = await singleReq(searchParameters);
  if (FirstPatentsRes.numFound == 0) return []; // Return an empty array when there are 0 patents
  const ReqSize = FirstPatentsRes.docs.length;
  const startPoints = recursiveStartPointsBuilder(
    !maxPatents || maxPatents > FirstPatentsRes.numFound // If there's no defined maximum, or if there are less results than the maximum
      ? FirstPatentsRes.numFound // Generate enough start points to cover the number of patents found
      : maxPatents, // Or just up to the maximum.
    ReqSize
  );
  // Retrieve the patents in parellel
  const LatterPatents = await Promise.all(
    startPoints.map(async (startPoint) => {
      return (
        await singleReq(
          Object.assign({}, searchParameters, { start: startPoint })
        )
      ).docs;
    })
  );
  return FirstPatentsRes.docs.concat(LatterPatents.flat(1));
};

export default usPatentData;

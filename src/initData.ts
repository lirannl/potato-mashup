import Axios from "axios";
import IappData from "./interfaces/appData";
import { usPatentRes } from "./interfaces/usPatentRespose";

/**
 * Initialise the app data objects
 */
const initData: (...params: any[]) => Promise<IappData> = async () => {
  // Retrieve data from US patent office
  const usPatentBasicRes: usPatentRes = await (
    await Axios.get("https://developer.uspto.gov/ibd-api/v1/patent/application")
  ).data.response;

  const usPatents = usPatentBasicRes.numFound;
  return { usPatents: usPatents };
};

export default initData;

import axios from "axios";
import IappData from "./interfaces/appData";
import { usPatentRes } from "./interfaces/usPatentRespose";

const initData: (...params: any[]) => Promise<IappData> = async () => {
  // Retrieve data from US patent office
  const usPatentBasicRes: usPatentRes = await (
    await axios.get("https://developer.uspto.gov/ibd-api/v1/patent/application")
  ).data.response;

  

  const usPatents = usPatentBasicRes.numFound;
  const euPatents = 25;
  return { usPatents: usPatents, euPatents: euPatents };
};

export default initData;

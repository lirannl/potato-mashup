import Axios from "axios";
import { usPatentRes, usPatentParams } from "../interfaces/usPatentRespose";

const retriever = async (searchParameters: usPatentParams) => {
  return (await (
    await Axios.get(
      `https://developer.uspto.gov/ibd-api/v1/patent/application`,
      { params: searchParameters }
    )
  ).data.response) as usPatentRes;
};

export default retriever;

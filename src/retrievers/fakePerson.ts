import Axios, { AxiosResponse } from "axios";

const getName: (...args: any)=>Promise<Object> = async () => {
  const thing = await Axios.get("https://randomuser.me/api/");
  return thing.data.results[0];
};

export default getName;
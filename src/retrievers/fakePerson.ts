import Axios, { AxiosResponse } from "axios";
import { IPerson } from "../interfaces/person";

const generatePerson: (...args: any) => Promise<IPerson> = async () => {
  const thing = await Axios.get("https://randomuser.me/api/");
  return Object.assign(thing.data.results[0], { picture: "" });
};

export default generatePerson;

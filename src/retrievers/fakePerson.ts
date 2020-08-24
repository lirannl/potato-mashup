import Axios, { AxiosResponse } from "axios";
import { IPerson } from "../interfaces/person";

const generatePerson: (
  ...args: any
) => Promise<{ person: IPerson }> = async () => {
  const thing = await Axios.get("https://randomuser.me/api/");
  return { person: Object.assign(thing.data.results[0], { picture: "" }) };
};

export default generatePerson;

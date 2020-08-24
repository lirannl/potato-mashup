import appData from "../interfaces/appData";
import usPatentData from "../retrievers/usPatentData";
import { safePatent } from "../interfaces/usPatentRespose";

const randomPatNum = (data: appData) =>
  Math.floor(Math.random() * 0.5 * data.usPatents + 10000000); // Generate a random patent number that's somewhat likely to clash with an existing patent (to showcase the fact that I can ensure that the patent number won't clash).

const safePatentNumGen: (
  data: appData,
  attNum?: number
) => Promise<{ patent: safePatent }> = async (data, attNum = 0) => {
  const num = randomPatNum(data);
  const patentData = await usPatentData({patentNumber: num});
  if (patentData.docs.length == 0) return {patent: {result: num, attemptsTaken: attNum + 1}};
  else return await safePatentNumGen(data, attNum + 1);
};

export default safePatentNumGen;

import appData from "../interfaces/appData";
import usPatentData from "../retrievers/usPatentData";

const randomPatNum = (data: appData) =>
  Math.floor(Math.random() * 0.5 * data.usPatents + 10000000); // Generate a random patent number that's somewhat likely to clash with an existing patent (to showcase the fact that I can ensure that the patent number won't clash).

const safePatentNumGen: (
  data: appData
) => Promise<{ result: number; attemptsTaken: number }> = async (
  data
) => {
  let num = randomPatNum(data);
  let attNum = 0;
  while ((await usPatentData(num)).docs.length > 0) {
    // Continue generating patent numbers until the US patent office doesn't come up with a patent (to ensure that there's no real patent)
    num = randomPatNum(data);
    attNum += 1;
  }
  return { result: Math.floor(num), attemptsTaken: attNum + 1 };
};

export default safePatentNumGen;

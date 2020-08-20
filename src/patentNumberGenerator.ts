import appData from "./interfaces/appData";
import usPatentData from "./retrievers/usPatentData";

const randomPatNum = (data: appData) =>
  Math.floor(Math.random() * (data.usPatents * 0.11) + 10000000); // Generate a random patent number that's somewhat likely to clash with an existing patent (to showcase the fact that I can ensure that the patent number won't clash).

const patentNumGen: (data: appData) => Promise<number> = async (data) => {
  let num = randomPatNum(data);
  let attNum = 0;
  while ((await usPatentData(num)).docs.length > 0) {
    // Continue generating patent numbers until the US patent office doesn't come up with a patent (to ensure that there's no real patent)
    num = randomPatNum(data);
    attNum += 1;
  }
  console.log(
    `Found a fake patent number after ${attNum} attempt${
      attNum == 1 ? "" : "s"
    }`
  );
  return Math.floor(num);
};

export default patentNumGen;

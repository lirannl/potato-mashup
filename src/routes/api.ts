import getPerson from "../retrievers/fakePerson";
import safePatentNumGen from "../retrievers/patentNumberGenerator";
import generatePerson from "../retrievers/fakePerson";
import IRoute from "../interfaces/route";

const api: IRoute = async (ctx) => {
  // Resolve all promises in parallel
  const resolvedPromises = await Promise.all([
    safePatentNumGen(ctx.data!).then((res) => ({ patent: res })),
    generatePerson().then((res) => ({ person: res })),
  ]);
  const syncObject = {} // Initial object with synchronously obtained values
  // Merge the promises into one object
  ctx.body = resolvedPromises.reduce(
    (acc, curr) => Object.assign(acc, curr),
    syncObject
  );
};

export default api;

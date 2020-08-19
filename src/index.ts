import Koa from "koa";
import appData from "./interfaces/appData";
import initData from "./initData";
const app = new Koa();
let data: appData;

const init = async () => {
  data = await initData();
  await ready();
};

const ready = async () => {
  console.log(`Now listening on port ${process.env.PORT || 8080}`);
};

app.use(async (ctx) => {
  ctx.body = {
    environment: process.env.TYPE,
    euPatents: data.euPatents,
    usPatents: data.usPatents,
  };
});

init().then(() => app.listen(process.env.PORT || 8080));

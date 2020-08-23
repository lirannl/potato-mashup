import Koa from "koa";
import Router from "koa-router";
import appData from "./interfaces/appData";
import initData from "./initData";
import api from "./routes/api";
const app = new Koa();
const router = new Router();
let data: appData;

const init = async () => {
  data = await initData();
  await ready();
};

const ready = async () => {
  console.log(`Now listening on port ${process.env.PORT || 8080}`);
};

router.post("/api", api);

app
  .use(async (ctx, next) => {
    Object.assign(ctx, { data: data });
    await next();
  })
  .use(router.routes());

init().then(() => app.listen(process.env.PORT || 8080));

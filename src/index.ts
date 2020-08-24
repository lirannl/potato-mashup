import Koa from "koa";
import Router from "koa-router";
import appData from "./interfaces/appData";
import initData from "./initData";
import api from "./routes/api";
import bodyParser from "koa-bodyparser";
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 8080;
let data: appData;

const init = async () => {
  data = await initData();
  await ready();
};

/**
 * Run actions on the initalised app before starting it
 */
const ready = async () => {
  console.log(`Running on ${process.env.TYPE}.\nNow listening on port ${port}`);
};

router.post("/api", api);

app
  .use(async (ctx, next) => {
    Object.assign(ctx, { data: data });
    await next();
  })
  .use(bodyParser())
  .use(async (ctx, next) => {
    console.log(`Recieved a ${ctx.request.method} request from ${ctx.request.ip}`);
    await next();
  })
  .use(router.routes());

init().then(() => app.listen(port));

import Koa from "koa";
import Router from "koa-router";
import api, { responseTransformer } from "./routes/api";
import serve from "koa-static";
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 8080;

const init = async () => {
  await ready();
};

/**
 * Run actions on the initalised app before starting it
 */
const ready = async () => {
  console.log(`Running on ${process.env.TYPE}.\nNow listening on port ${port}`);
};

interface validAsync {
  (ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>): Promise<void>
}

router
  .get("/api", api as validAsync)
  // Mock data route - on development mode only
  .get("/mock", async (ctx, next) => {
    if (process.env.TYPE != "development") {
      await next();
    }
    else {
      ctx.response.body = require("./build/response.json");
    }
  });

app
  .use(require("@koa/cors")())
  .use(async (ctx, next) => {
    console.log(`Recieved a ${ctx.request.method} request from ${ctx.request.ip}`);
    await next();
  })
  .use(router.routes())
  .use(() => { if (process.env.TYPE != "development") return serve("res")}); // In production, resort to statically serving the "res" folder

init().then(() => app.listen(port));

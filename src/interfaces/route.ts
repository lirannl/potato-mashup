import Koa from "koa";
import Router from "koa-router";
import IAppContext from "./appContext";
export default interface IRoute {
    (ctx: IAppContext, next: Koa.Next): Promise<void>
}
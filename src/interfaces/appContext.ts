import Koa from "koa";
import Router from "koa-router";
import AppData from "./appData";
export default interface IAppContext extends Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>> {
    data?: AppData;
}
import Koa from 'koa';
import appData from './appData';
const app = new Koa();
let data: appData;

const init = async () => {
    data = {
        usPatents: 15,
        euPatents: 20,
    }
    await ready();
}

const ready = async () => {
    await console.log(`Now listening on port ${process.env.PORT || 8080}`);
}

app.use(async ctx => {
    ctx.body = `Hello, I'm running in ${process.env.TYPE}.`;
});

init().then(()=>app.listen(process.env.PORT || 8080));
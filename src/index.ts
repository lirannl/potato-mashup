import Koa from 'koa';
const app = new Koa();

app.use(ctx => {
    ctx.body = `Hello, I'm running in ${process.env.TYPE}.`;
});

console.log(`Now listening on port ${process.env.PORT ?? 8080}`);
app.listen(process.env.PORT ?? 8080);
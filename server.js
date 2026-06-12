const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("TVLEGAL PROXY funcionando");
});

app.use("/proxy", (req, res, next) => {

    const url = req.query.url;

    if (!url) {
        return res.status(400).send("Falta parametro url");
    }

    createProxyMiddleware({
        target: url,
        changeOrigin: true,
        secure: false,
        pathRewrite: () => "",
        router: () => url,
        onProxyReq(proxyReq) {
            proxyReq.setHeader("Origin", "");
            proxyReq.setHeader("Referer", "");
        }
    })(req, res, next);

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Servidor activo en puerto " + PORT);
});

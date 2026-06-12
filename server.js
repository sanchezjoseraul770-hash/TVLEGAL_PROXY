const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("TVLEGAL PROXY funcionando");
});

app.use("/stream", createProxyMiddleware({
    target: "http://190.61.101.11:7050",
    changeOrigin: true,
    pathRewrite: {
        "^/stream": ""
    }
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor activo en puerto " + PORT);
});

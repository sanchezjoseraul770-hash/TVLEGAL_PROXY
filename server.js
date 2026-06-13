const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("TVLEGAL PROXY funcionando");
});

app.get("/proxy", async (req, res) => {
    try {

        const url = req.query.url;

        if (!url) {
            return res.status(400).send("Falta parametro url");
        }

        const respuesta = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const tipo = respuesta.headers.get("content-type") || "";

        if (
            tipo.includes("mpegurl") ||
            url.includes(".m3u8")
        ) {

            let texto = await respuesta.text();

            const base = new URL(url);

            texto = texto.replace(
                /^([^#].*)$/gm,
                (linea) => {

                    if (
                        linea.startsWith("http")
                    ) {
                        return "/proxy?url=" +
                            encodeURIComponent(linea);
                    }

                    const absoluta =
                        new URL(linea, base).href;

                    return "/proxy?url=" +
                        encodeURIComponent(absoluta);
                }
            );

            res.setHeader(
                "Content-Type",
                "application/vnd.apple.mpegurl"
            );

            return res.send(texto);
        }

        const buffer =
            Buffer.from(await respuesta.arrayBuffer());

        res.send(buffer);

    } catch (e) {
        console.error(e);
        res.status(500).send("Error proxy");
    }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Servidor activo en puerto " + PORT);
});

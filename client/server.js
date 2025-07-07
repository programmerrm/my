import express from "express";
import compression from "compression";
import { createRequestHandler } from "@remix-run/express";

const app = express();
app.use(compression());

app.use(express.static("public"));
app.use("/assets", express.static("./build/client/assets"));

const port = process.env.PORT || 3001;
(async () => {
    const build = await import("./build/server/index.js");
    app.all(
        "*",
        createRequestHandler({
            build,
            mode: process.env.NODE_ENV,
        })
    );
    app.listen(port, () => {
        console.log(`✅ Remix app running at http://localhost:${ port }`);
    });
})();

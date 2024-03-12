import path from "path"
import { fileURLToPath } from 'url'
import fs from "fs"
import config from "./config.json" assert {type: "json"}
import { createWebServer } from "./server/webserver.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

globalThis.config = config
globalThis.appPath = __dirname
globalThis.publicPath = path.resolve(__dirname, "public")
globalThis.serverPath = path.resolve(__dirname, "server")

createWebServer()
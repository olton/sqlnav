import path from "path"
import { fileURLToPath } from 'url'
import config from "./config.json" assert {type: "json"}
import {createLocalDB} from "./Modules/local-db.js";
import {createWebServer} from "./Modules/webserver.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

globalThis.config = config
globalThis.serverPath = __dirname
globalThis.publicPath = path.resolve(__dirname, 'public')

globalThis.DB = createLocalDB()

createWebServer(config.server)
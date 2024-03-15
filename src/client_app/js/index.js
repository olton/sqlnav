import "../less/index.less"
import View from "./view.js"
import WS from "./ws.js";
import {wsController} from "./ws-controller.js";

globalThis.ws = new WS({host: "localhost", secure: false, controller: wsController})
globalThis.view = new View()
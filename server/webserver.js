import http from "http"
import express from "express"
import favicon from "serve-favicon"
import {WebSocketServer} from "ws"
import {createWebSocketServer} from "./websocket.js";
import session from "express-session"
import path from "path";

const app = express()

const routes = () => {
    app.get('/', async (req, res) => {
        res.render('index', {
            title: 'SQLNav - Bringing PostgresSQL to the web',
            client: config.client
        })
    })
}

export const createWebServer = () => {
    const {host, port} = config.server
    const httpServer = http.createServer({}, app)

    app.set('trust proxy', 1)

    app.use(express.static(publicPath))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(session({
        secret: config.server.secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    }))
    app.use(favicon(path.join(publicPath, 'favicon.svg')))

    app.locals.pretty = true

    app.set('views', publicPath)
    app.set('view engine', 'pug')

    routes()

    httpServer.listen(port, host, () => {
        console.log(`SQLNav is running on http://${host}:${port}`)
    })

    globalThis.wss = new WebSocketServer({ server: httpServer })

    createWebSocketServer()
}
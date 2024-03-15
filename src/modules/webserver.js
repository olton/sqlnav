import http from "node:http"
import express from "express"
import favicon from "serve-favicon"
import path from "path"
import { WebSocketServer } from "ws"

const app = express()

export const createWebServer = () => {
    const {host = "localhost", port = 80} = config.server
    const server = http.createServer({}, app)

    app.use(express.static(publicPath))
    app.use(favicon(path.join(publicPath, 'favicon.svg')))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.locals.pretty = true

    app.set('views', publicPath)
    app.set('view engine', 'pug')

    routes()

    server.listen(port, host, () => {
        console.log(`SQL Navigator Server is running on http://${host}:${port}`)
    })

    const wss = new WebSocketServer({server})

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        response(ws, "welcome", `Welcome to SQL Navigator Server`)

        ws.on('message', (msg) => {
            processMessage(ws, msg)
        })
    })
}

const routes = () => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: `SQL Navigator`,
            client: JSON.stringify(config.client)
        })
    })
}

const response = (ws, channel, data) => ws.send(JSON.stringify({channel, data}))

const processMessage = (ws, msg) => {
    const {channel, data} = msg
    switch (channel) {
        default: {
            response(ws, channel, data)
            break
        }
    }
}
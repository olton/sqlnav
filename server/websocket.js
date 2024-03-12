import WebSocket, { WebSocketServer} from "ws";

export const createWebSocketServer = () => {
    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        ws.send(JSON.stringify({
            channel: "welcome",
            data: `Welcome to SQLNav Server`
        }))

        ws.on('message', async msg => {
            const {channel, data} = JSON.parse(msg)
            switch (channel) {
                default: {
                    wssResponse(ws, channel, data)
                }
            }
        })
    })
}

export const wssResponse = (ws, channel, data) => {
    ws.send(JSON.stringify({
        channel,
        data
    }))
}

export const wssBroadcast = (data) => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}
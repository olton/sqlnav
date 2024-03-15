export default class WS {
    ws = null
    controller = null

    constructor(options) {
        this.controller = options.controller
        this.connect(options)

        this.ws.onmessage = event => {
            try {
                const content = JSON.parse(event.data)
                if (typeof this.controller === 'function') {
                    this.controller.apply(null, [ws, content])
                }
            } catch (e) {
                console.log(e.message)
                console.log(event.data)
                console.log(e.stack)
            }
        }

        this.ws.onerror = error => {
            console.error('Socket encountered error: ', error.message, 'Closing socket');
            this.ws.close();
        }

        this.ws.onclose = event => {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
            setTimeout(this.connect, 1000)
        }

        this.ws.onopen = event => {
            console.log('Connected to SQL Navigator, wait for welcome message!');
        }
    }

    isOpen(){
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    send(channel, data) {
        if (this.isOpen()) {
            this.ws.send(JSON.stringify({channel, data}));
        }
    }

    connect({host = "localhost", secure = false} = {}){
        this.ws = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}`)
    }
}
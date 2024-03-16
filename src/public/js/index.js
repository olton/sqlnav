
/*!
 * SQL Navigator (https://sqlnav.com)
 * Copyright 2024 by Serhii Pimenov
 * Licensed under GPLv3
 !*/

(function () {
    'use strict';

    class View {
        pageIndex = 1

        constructor() {
            this.createEvents();
        }

        createEvents(){
            $(document).on('click', '#explorer-toggle', () => {
                $("html").removeClass("no-explorer");
            });
            $(document).on('click', '#explorer-hide', () => {
                $("html").addClass("no-explorer");
            });
            $(document).on('click', '#add-ds', () => {
                this.showAddDataSourceDialog();
            });
            $(document).on('click', '#new-editor', () => {
                this.createQueryEditor();
            });
        }

        createQueryEditor(text = ''){
            const pc = Metro.getPlugin("#pc", "page-control");
            pc.addTab({
                caption: `Query ${this.pageIndex}`,
                ref: `#content${this.pageIndex}`
            });

            $("<div>")
                .id(`content${this.pageIndex}`)
                .addClass("content-window")
                .html(`
                <div data-role="splitter" data-split-mode="vertical" data-split-sizes="50, 50" data-gutter-size="10" class="gutter-style-dotted data-window">
                    <div class="sql-editor">
                        <div class="sql-editor-content" id="editor${this.pageIndex}"></div>
                    </div>
                    <div class="sql-result">
                        <div class="sql-result-content" id="result${this.pageIndex}"></div>
                    </div>
                </div>
            `)
                .appendTo("#content-holder");

            monaco.editor.create($(`#editor${this.pageIndex}`)[0], {
                value: text,
                language: 'pgsql',
                automaticLayout: true,
            });

            this.pageIndex++;
        }

        showAddDataSourceDialog(){
            Metro.dialog.create({
                title: `Add Data Source`,
                content: `
                <form>
                    <div>
                        <label>Data Source Name</label>
                        <input data-role="input" type="text" name="ds-name" data-prepend="<span class='mif-database'>">
                    </div>
                    <div class="mt-1">
                        <label>User</label>
                        <input data-role="input" type="text" name="ds-user" autocomplete="username" data-prepend="<span class='mif-user'>">
                    </div>
                    <div class="mt-1">
                        <label>Password</label>
                        <input data-role="input" type="password" name="ds-password" autocomplete="new-password" data-prepend="<span class='mif-lock'>">
                    </div>                        
                </form>
            `,
                actions: [
                    {
                        caption: "Add Data Source",
                        cls: "js-dialog-close info",
                        onclick: function(){
                        }
                    },
                    {
                        caption: "Cancel",
                        cls: "js-dialog-close",
                    },
                ],
                actionsAlign: "left"
            });
        }
    }

    class WS {
        ws = null
        controller = null

        constructor(options) {
            this.controller = options.controller;
            this.connect(options);

            this.ws.onmessage = event => {
                try {
                    const content = JSON.parse(event.data);
                    if (typeof this.controller === 'function') {
                        this.controller.apply(null, [ws, content]);
                    }
                } catch (e) {
                    console.log(e.message);
                    console.log(event.data);
                    console.log(e.stack);
                }
            };

            this.ws.onerror = error => {
                console.error('Socket encountered error: ', error.message, 'Closing socket');
                this.ws.close();
            };

            this.ws.onclose = event => {
                console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
                setTimeout(this.connect, 1000);
            };

            this.ws.onopen = event => {
                console.log('Connected to SQL Navigator, wait for welcome message!');
            };
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
            this.ws = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}`);
        }
    }

    const wsController = (ws, res) => {
        const {channel, data} = res;

        switch (channel) {
            case "welcome": {
                console.log(`Welcome to SQL Navigator Server`);
                break
            }
        }
    };

    globalThis.ws = new WS({host: "localhost", secure: false, controller: wsController});
    globalThis.view = new View();

})();
//# sourceMappingURL=index.js.map

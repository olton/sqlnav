export default class View {
    pageIndex = 1

    constructor() {
        this.createEvents()
    }

    createEvents(){
        $(document).on('click', '#explorer-toggle', () => {
            $("html").removeClass("no-explorer")
        });
        $(document).on('click', '#explorer-hide', () => {
            $("html").addClass("no-explorer")
        });
        $(document).on('click', '#add-ds', () => {
            this.showAddDataSourceDialog()
        });
        $(document).on('click', '#new-editor', () => {
            this.createEditor()
        });
    }

    createEditor(text = ''){
        const pc = Metro.getPlugin("#pc", "page-control")
        pc.addTab({
            caption: `Unnamed ${this.pageIndex}`,
            ref: `#content${this.pageIndex}`
        })

        $("<div>")
            .id(`content${this.pageIndex}`)
            .addClass("content-window")
            .html(`
                <div data-role="splitter" data-split-mode="vertical" data-split-sizes="100, 0" data-gutter-size="10" class="gutter-style-dotted">
                    <div class="sql-editor" id="editor${this.pageIndex}"></div>
                    <div class="sql-result" id="result${this.pageIndex}"></div>
                </div>
            `)
            .appendTo("#content-holder")

        monaco.editor.create($(`#editor${this.pageIndex}`)[0], {
            value: text,
            language: 'sql'
        })

        this.pageIndex++
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
        })
    }
}

import Database from 'better-sqlite3'
import path from "path"

export class LocalDB {
    db = null
    constructor() {
        const dbPath = path.resolve(serverPath, 'db', 'sqlnav.db')
        this.db = new Database(dbPath, { verbose: console.log })
        this.db.pragma('journal_mode = WAL');
        this.db.exec(` create table if not exists data_sources( id INTEGER PRIMARY KEY ASC, name, user, pass ) `)
    }

    getDataSources(){
        const sql = this.db.prepare(`select * from data_sources`)
        return sql.all()
    }

    getDataSource(id){
        const sql = this.db.prepare(`select * from data_sources where id = ?`).bind(id)
        return sql.get()
    }

    storeDataSource(name, user, pass){
        return this.db.prepare(`insert into data_sources (name, user, pass) values (?, ?, ?)`).run(name, user, pass)
    }

    deleteDataSource(id){
        return this.db.prepare(`delete from data_sources where id = ?`).run(id)
    }
}

export const createLocalDB = () => new LocalDB()
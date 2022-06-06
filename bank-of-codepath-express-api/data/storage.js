const lowdb = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

class Storage {
  constructor() {
    this.path = `${__dirname}/db.json`
    this.setup()
  }

  async setup() {
    const adapter = new FileSync(this.path)
    this.db = lowdb(adapter)
    this.db.defaults({ transfers: [], transactions: [] }).write()
  }

  get(key) {
    return this.db.get(key)
  }
}

module.exports = {
  storage: new Storage(),
}

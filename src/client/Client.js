const mongoose = require('mongoose')

class Client {
    constructor(mongoURL) {
        mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(db => console.log(`Connected database ${db.connections[0].name}`))
        .catch(err => console.error(err))
    }
}

module.exports = {
    Client
}
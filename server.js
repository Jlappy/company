const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('unhandle! shutting down ...');
    console.log(err.name, err.message);
    process.exit(1)
})
dotenv.config({ path: './.env' });

const app = require('./app');
const DB = process.env.DB_URL;

mongoose.connect(DB)
    .then(() => { console.log('DB connection successful'); })
    .catch((err) => console.log(err));

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
    console.log('App running on port ${post}');
})
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');

dotenv.config({ path: './config.env' });

require('./db/conn');

app.use(cors())
app.use(express.json());

const PORT = process.env.PORT;

app.use(require('./routes/auth'));

app.get('/login', (req, res) => {
    res.send('Hello from the login');
});

app.listen(5000, () => {
    console.log(`running server at ${PORT}`);
});
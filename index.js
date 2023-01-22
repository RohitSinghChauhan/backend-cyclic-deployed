const express = require('express');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT;
const connection = require('./config/db');
const userRoute = require('./routes/user.route');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.listen(PORT, async () => {
    try {
        await connection;
        console.log('CONNECTED TO DB');
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Listening ${PORT}`);
});
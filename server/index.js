const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRouter = require('./routes/user.js');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, Authorization'
    );
    next();
});
app.use(express.json({ limit: '10MB' }));

app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('Hello, welocme to  API!');
});

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((error) => console.log(`${error} did not connect`));

const server = app.listen(PORT, () =>
    console.log('Hello! This is backend, listening on port - ', PORT)
);

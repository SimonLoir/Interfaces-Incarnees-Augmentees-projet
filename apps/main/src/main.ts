import express from 'express';
import * as Leap from 'leapjs';

const ctl = new Leap.Controller({});
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});

import express from 'express';
import {json} from 'body-parser';

const app = express();

app.use(json());

app.listen(5000, () => {
    console.log('server running');
})
import express from 'express';

const app = express();

app.get('/ads', (req, res) => {
    res.json([
        { id: 1, "name": 'abc' },
        { id: 2, "name": 'abc' },
        { id: 3, "name": 'abc' },
        { id: 4, "name": 'abc' },
    ]);

});

app.listen(3333);
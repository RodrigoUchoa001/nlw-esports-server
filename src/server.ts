import express, { json } from 'express';

const app = express();

app.get('/games', (req,res) =>{
    res.json([]);
})

app.post('/ads', (req,res) =>{
    res.status(201).json([]);
})

app.get('/games/:id/ads', (req, res) => {
    const gameId = req.params.id;

    res.json([
        { id: 1, "name": 'abc' },
        { id: 2, "name": 'abc' },
        { id: 3, "name": 'abc' },
        { id: 4, "name": 'abc' },
    ]);

});

app.get('/ads/:id/discord', (req, res) => {
    const adId = req.params.id;

    res.json([]);
});

app.listen(3333);
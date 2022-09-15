import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string';

const app = express();
app.use(express.json());
// com o cors posso expecificar qual o dominio de front end q pode usar 
// esse backend colocando por exemplo:
// app.use(cors({
//  origin : 'http://rocketseat.com.br'
// }));
// colocando da forma abaixo todos os front end consegue usar 
app.use(cors());

const prisma = new PrismaClient({
    // pra aparecer no terminal as queries, quando for feita uma.
    log: ['query']
});

app.get('/games', async (req,res) =>  {
    const games = await prisma.game.findMany({
        include: {
           _count: {
            select: {
                ads: true
            }
           }
        }
    });
    res.json(games);
})

app.post('/games/:id/ads', async (req,res) =>{
    const gameId = req.params.id;
    const body = req.body;    

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    });


    res.status(201).json(ad);
})

app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc',
        } 
    });

    res.json(ads.map(ad => {
        // pra fazer com q o weekdays seja dividido e transformado em array
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd),
        }
    }));
});

app.get('/ads/:id/discord', async (req, res) => {
    const adId = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId
        }
    });

    res.json({
        discord: ad.discord,
    });
});

app.listen(3333);
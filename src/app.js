import express from 'express'

const app = express();

app.get('/', (res, req) => { req.status(200).send('Hello from Acquisitions!') })

export default app
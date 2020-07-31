import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import routes from './src/routes';
require('dotenv').config();

var app = express();
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use('/', routes());

const port = process.env.PORT || 8080;
app.listen(port, (err) => {
  if (err) {
    console.log("Server running error", err)
  }
  console.log(`Server listening on port: ${port}`)
});
app.timeout = 360000;

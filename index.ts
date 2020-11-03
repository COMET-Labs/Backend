import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const { PORT, MONGO_CONNECTION_URI } = process.env;

const port = PORT || 8000;

const app = express();

mongoose.connect(MONGO_CONNECTION_URI || '').then((_) => {
  console.log('> Connected to Database');

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.listen(port, () => console.log(`> Server running on port ${port}`));
});

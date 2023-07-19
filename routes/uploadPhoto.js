import { Router } from 'express';
import fs from 'fs';
import shortid from 'shortid';
import multer from 'multer';
import { insertImage } from '../db/images.js';

const routerPhoto = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'static/photos/');
  },
  filename: (_req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  },
});

const upload = multer({ storage });

routerPhoto.post('/', async (req, res) => {
  const { adID } = req.body;
  const { originalname } = req.file;
  const newName = adID + originalname;

  try {
    fs.rename(`static/photos/${originalname}`, `static/photos/${newName}`, (err) => {
      if (err) {
        throw err;
      }
    });
    const data = {};
    data.imageID = shortid.generate().toString();
    data.imagePath = `${newName}`;
    data.adID = adID;
    try {
      await insertImage(data);
      res.status(200).send('Photo succesfully uploaded');
    } catch (err) {
      console.error('Could\'t save photo into database');
      res.status(500).render('error', { message: `Could't save photo into database: ${err.message}` });
    }
  } catch (err) {
    console.error('Fs rename error');
    res.status(500).render('error', { message: 'Fs rename error' });
  }
});

export { routerPhoto, upload };

import express from 'express';
import fs from 'fs';
import * as dbAd from '../db/ads.js';
import * as dbImage from '../db/images.js';
import { setUserRole } from '../db/users.js';

const router = express.Router();

router.get('/showDetails/:id', async (req, res) => {
  try {
    const adData = await dbAd.getAdByID(req.params.id);
    res.set('Content-type', 'application/josn');
    res.send(JSON.stringify(adData));
  } catch (err) {
    console.error('Could\'t send details');
    res.json({ message: `Could't send details: ${err.message}` });
  }
});

router.get('/torol/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const imagePath = await dbImage.getImagePathFromImageID(imageId);
    const relativePath = `./static/photos/${imagePath}`;
    try {
      fs.unlink(relativePath, (err) => {
        if (err) throw err;
        console.log('Image deleted from memory!');
      });
    } catch (err) {
      console.error('Could\'t delete image');
      res.json({ message: `Could't delete image: ${err.message}` });
      return;
    }

    await dbImage.deleteImage(imageId);
    res.status(204).send('Photo succesfully deleted');
  } catch (err) {
    console.error('Could\'t delete image');
    res.json({ message: `Could't delete image: ${err.message}` });
  }
});

router.get('/deleteAd/:adID', async (req, res) => {
  try {
    const { adID } = req.params;
    const imagesData = await dbImage.getImagesByID(adID);
    const hasImages = imagesData[1];
    const imagesPaths = imagesData[0];
    if (hasImages) {
      for (let i = 0; i < imagesPaths.length; i += 1) {
        const relativePath = `./static/photos/${imagesPaths[i].imagePath}`;
        try {
          fs.unlink(relativePath, (err) => {
            if (err) throw err;
            console.log('Image deleted from memory!');
          });
        } catch (err) {
          console.error('Could\'t delete image');
          res.json({ message: `Could't delete image: ${err.message}` });
          return;
        }
      }
      try {
        await dbImage.deleteImages(imagesPaths);
      } catch (err) {
        console.log(err);
        console.log('imge hiba');
        return;
      }
    }
    await dbAd.deleteAdById(adID);

    res.status(204).send('ad succesfully deleted');
  } catch (err) {
    console.error('Could\'t delete ad');
    res.json({ message: `Could't delete ad: ${err.message}` });
  }
});

router.get('/changeRoleToUser/:userName', async (req, res) => {
  const { userName } = req.params;
  try {
    await setUserRole(userName, 'User');
    const role = 'User';
    res.clearCookie('role');
    res.cookie('role', role, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(204).send('User role succesfully changed');
  } catch (err) {
    console.error('Could\'t change the role of user');
    res.json({ message: `Could't change the role of user: ${err.message}` });
  }
});

router.get('/changeRoleToAdmin/:userName', async (req, res) => {
  const { userName } = req.params;
  try {
    await setUserRole(userName, 'Admin');
    const role = 'Admin';
    res.clearCookie('role');
    res.cookie('role', role, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(204).send('User role succesfully changed');
  } catch (err) {
    console.error('Could\'t change the role of user');
    res.json({ message: `Could't change the role of user: ${err.message}` });
  }
});

export default router;

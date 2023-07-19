import  { Router } from 'express';
import { getAdByID } from '../db/ads.js';
import { getImagesByID } from '../db/images.js';
import { getUserNameByUserID } from '../db/users.js';
import adBelongsToLogedUser from '../static/otherModuels/adOwner.js';
import logedUser from '../static/otherModuels/logedUser.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';

const detailRouter = Router();

detailRouter.post('/', async (req, res) => {
  let oneAd,
    adOwner;
  const { adID } = req.body;
  try {
    oneAd = await getAdByID(adID);
    adOwner = await getUserNameByUserID(oneAd.userID);
  } catch (err) {
    res.status(500).render('error', {
      message: `Failed to get data from database: ${err.message}`,
    });
  }
  try {
    const imagesData = await getImagesByID(adID);
    // az elso visszkuldott ertek a kepek path-jat tartalmazo lista
    // (egy lakashirdeteshez tobb kep is tartozhat)
    // a masodik visszakuldott ertek megmondja, hogy van-e egyeltalan kep feltoltve
    const notEmpty = imagesData[1];
    const images = imagesData[0];
    const ad = oneAd;
    ad.adID = adID;
    ad.owner = adOwner;
    const loged = logedUser(req);
    const logedUserName = loged[0],
      isLogedIn = loged[1];
    const adIsLogedinUsers = await adBelongsToLogedUser(req, adID);
    let role;
    if (isLogedIn) {
      if (await userIsAdmin(logedUserName)) {
        role = 'admin';
      } else {
        role = 'user';
      }
    }
    res.render('details', {
      ad, notEmpty, images, logedUserName, isLogedIn, adIsLogedinUsers, role,
    });
  } catch (err) {
    res.status(500).render('error', {
      message: `Failed to render details page: ${err.message}`,
    });
  }
});

export default detailRouter;

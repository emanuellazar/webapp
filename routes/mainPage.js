import  { Router } from 'express';
import { getFilteredAds, getAllAds } from '../db/ads.js';
import logedUser from '../static/otherModuels/logedUser.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';
import { getUserNameByUserID } from '../db/users.js';

const fooldalRouter = Router();

async function addOwnersToAds(ads, userName) {
  const owners = [];
  for (let i = 0; i < ads.length; i += 1) {
    owners.push(getUserNameByUserID(ads[i].userID));
  }
  const results = await Promise.all(owners);
  const adsCopy = ads;
  for (let i = 0; i < ads.length; i += 1) {
    adsCopy[i].owner = results[i];
    adsCopy[i].logedUserIsOwner = results[i] === userName;
  }
  return adsCopy;
}

fooldalRouter.get('/', async (req, res) => {
  try {
    let ads = await getAllAds();
    const empty = ads.length === 0;
    const loged = logedUser(req);
    const logedUserName = loged[0],
      isLogedIn = loged[1];
    ads = await addOwnersToAds(ads, logedUserName);
    let isUserAdmin,
      role = 'guest';
    if (isLogedIn) {
      isUserAdmin = await userIsAdmin(logedUserName);
    } else {
      isUserAdmin = false;
      role = 'user';
    }
    if (isUserAdmin) {
      role = 'admin';
    } else {
      role = 'user';
    }
    res.render('mainPage', {
      ads, empty, logedUserName, isLogedIn, isUserAdmin, role,
    });
    console.log('Main page succesfully rendered');
  } catch (err) {
    console.log('Could\'t get ads from database');
    res.status(500).render('error', { message: `Could't get ads from database: ${err.message}` });
  }
});

fooldalRouter.post('/', async (req, res) => {
  try {
    const criteria = {};
    criteria.varos = req.body.varosSearch;
    criteria.negyed = req.body.negyedSearch;
    const minAr = req.body.minArSearch;
    const maxAr = req.body.maxArSearch;
    criteria.minAr = parseInt(minAr, 10);
    criteria.maxAr = parseInt(maxAr, 10);
    const loged = logedUser(req);
    const logedUserName = loged[0],
      isLogedIn = loged[1];
    let ads = await getFilteredAds(criteria);
    ads = await addOwnersToAds(ads, logedUserName);
    const empty = ads.length === 0;
    let role = 'guest';
    let isUserAdmin;
    if (isLogedIn) {
      isUserAdmin = await userIsAdmin(logedUserName);
    } else {
      isUserAdmin = false;
      role = 'user';
    }
    if (isUserAdmin) {
      role = 'admin';
    } else {
      role = 'user';
    }
    res.render('mainPage', {
      ads, empty, logedUserName, isLogedIn, role, isUserAdmin,
    });
    console.log('Main page succesfully rendered');
  } catch (err) {
    console.log('Could\'t get ads from database');
    res.status(500).render('error', { message: `Could't get filtered ads from database: ${err.message}` });
  }
});

export default fooldalRouter;

import express from 'express';
import shortid from 'shortid';
import { getDataFromOneUser, getUserData } from '../db/users.js';
import { insertAd } from '../db/ads.js';
import logedUser from '../static/otherModuels/logedUser.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';

const createAdRouter = express.Router();

function validate(req) {
  const textRegex = /[A-z ]/;
  const numberRegex =  /[1-9][0-9]*/;
  const dateRegex = /([1-9][0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;
  if (textRegex.test(req.body.varos) && textRegex.test(req.body.negyed)
  && numberRegex.test(req.body.felszinterulet) &&  numberRegex.test(req.body.ar)
  && numberRegex.test(req.body.szobakSzama) && dateRegex.test(req.body.datum)) {
    return true;
  }
  return false;
}

createAdRouter.get('/', async (req, res) => {
  try {
    const users = await getUserData();
    const loged = logedUser(req);
    const logedUserName = loged[0],
      isLogedIn = loged[1];
    let role;
    if (isLogedIn) {
      if (await userIsAdmin(logedUserName)) {
        role = 'admin';
      } else {
        role = 'user';
      }
    }
    res.render('createAd', {
      users, logedUserName, isLogedIn, role,
    });
  } catch (err) {
    res.status(500).render('error', {
      message: `Failed to get data from database: ${err.message}`,
    });
  }
});

createAdRouter.post('/', async (req, res) => {
  const isValid = validate(req);
  if (!isValid) {
    res.status(422).render('error', { message: 'Invalid input' });
    return;
  }
  try {
    const data = req.body;
    const userData = logedUser(req);
    const userName = userData[0];
    const dataFromDatabase = await getDataFromOneUser(userName);
    data.adID = shortid.generate().toString();
    data.userID = dataFromDatabase.userID;
    await insertAd(data);
    res.status(200).redirect('/');
  } catch (err) {
    res.status(500).render('error', {
      message: `Failed to get data from database: ${err.message}`,
    });
  }
});

export default createAdRouter;

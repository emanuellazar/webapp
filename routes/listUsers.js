import express from 'express';
import { getFilteredUserData, getUserData } from '../db/users.js';
import logedUser from '../static/otherModuels/logedUser.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';

const listUsersRouter = express.Router();

listUsersRouter.get('/', async (req, res) => {
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
  let userData;
  try {
    userData = await getUserData();
  } catch (err) {
    console.log('Could\'t get user data from database');
    res.status(500).render('error', { message: `Could't get user data from database: ${err.message}` });
  }
  res.render('listUsers', {
    logedUserName, isLogedIn, role, userData,
  });
});

listUsersRouter.post('/', async (req, res) => {
  const { userNameCriteria } = req.body;
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
  let userData;
  try {
    userData = await getFilteredUserData(userNameCriteria);
  } catch (err) {
    console.log('Could\'t get user data from database');
    res.status(500).render('error', { message: `Could't get user data from database: ${err.message}` });
  }
  res.render('listUsers', {
    logedUserName, isLogedIn, role, userData,
  });
});

export default listUsersRouter;

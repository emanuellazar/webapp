import express from 'express';
import { getFilteredUserData, getUserData } from '../db/users.js';
import logedUser from '../static/otherModuels/logedUser.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';

const messgaesUserListRouter = express.Router();

messgaesUserListRouter.get('/', async (req, res) => {
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
    for (let i = 0; i < userData.length; i += 1) {
      if (userData[i].userName === logedUserName) {
        userData.splice(i, 1);
      }
    }
  } catch (err) {
    console.log('Could\'t get user data from database');
    res.status(500).render('error', { message: `Could't get user data from database: ${err.message}` });
  }
  res.render('chatRoomEveryone', {
    logedUserName, isLogedIn, role, userData,
  });
});

messgaesUserListRouter.post('/', async (req, res) => {
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
    for (let i = 0; i < userData.length; i += 1) {
      if (userData[i].userName === logedUserName) {
        userData.splice(i, 1);
      }
    }
  } catch (err) {
    console.log('Could\'t get user data from database');
    res.status(500).render('error', { message: `Could't get user data from database: ${err.message}` });
  }
  res.render('chatRoomEveryone', {
    logedUserName, isLogedIn, role, userData,
  });
});

export default messgaesUserListRouter;

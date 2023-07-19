import jwt from 'jsonwebtoken';
import secret from '../configuration/config.js';
import { getDataFromOneUser } from '../db/users.js';

function chechToken(req, res, next) {
  res.locals.payload = {};
  const { token } = req.cookies;
  if (token) {
    try {
      const payload = jwt.verify(token, secret);
      res.locals.payload = payload;
    } catch (error) {
      res.clearCookie('token');
      console.log('The token is not valid');
      res.status(500).render('error', { message: 'The token is not valid' });
      return;
    }
  } else {
    console.log('The user is not logged in');
    res.status(500).render('error', { message: 'Login in order to acces this page' });
  }
  next();
}

async function isAdmin(req, res, next) {
  const { userName } = req.cookies;
  const userData = await getDataFromOneUser(userName);
  if (userData.role !== 'Admin') {
    console.log('Trying to acces area only accesible to Admins');
    res.status(500).render('error', { message: 'Acces denied, only admins can acces this page' });
    return;
  }
  next();
}

export { chechToken, isAdmin };

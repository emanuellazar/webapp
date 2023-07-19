import express from 'express';
import util from 'util';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import secret from '../configuration/config.js';
import { getDataFromOneUser } from '../db/users.js';
import logedUser from '../static/otherModuels/logedUser.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';

const loginRouter = express.Router();

function validate(userName) {
  const textRegex = /[A-z ]/;
  return textRegex.test(userName);
}

loginRouter.get('/', async (req, res) => {
  try {
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
    res.render('login', { logedUserName, isLogedIn, role });
    console.log('Login page succesfully rendered');
  } catch (err) {
    console.log('Could\'t render login page');
    res.status(500).render('error', JSON.parse({ message: 'Couldn\'t render login page' }));
  }
});

loginRouter.post('/', async (req, res) => {
  const { userName, password } = req.body;
  const isValid = validate(userName);
  if (!isValid) {
    res.status(422).render('error', { message: 'Invalid input' });
    return;
  }

  try {
    const hashSize = 25,
      hashAlgorithm = 'sha512',
      iterations = 10;
    const dataUser = await getDataFromOneUser(userName);
    const pbkdf2 = util.promisify(crypto.pbkdf2);
    const { passwordHash } = dataUser;
    let { salt } = dataUser;
    salt = Buffer.from(salt, 'base64');
    let hash = await pbkdf2(password, salt, iterations, hashSize, hashAlgorithm);
    hash = hash.toString('base64');
    if (hash === passwordHash) {
      const token = jwt.sign({ username: userName }, secret);
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('userName', userName, {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.status(200).redirect('/');
    } else {
      res.status(500).render('error', { message: 'Wrong password' });
    }
  } catch (err) {
    if (err.name === 'TypeError') {
      console.error('invalid username');
      res.status(500).render('error', { message: 'Invalid username' });
    } else {
      console.error('Could\'t get data of user from database');
      res.status(500).render('error', { message: `Could't get data of user from database: ${err.message}` });
    }
  }
});

export default loginRouter;

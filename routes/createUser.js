import express from 'express';
import shortid from 'shortid';
import crypto from 'crypto';
import util from 'util';
import logedUser from '../static/otherModuels/logedUser.js';
import { insertUser } from '../db/users.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';

const createUserRouter = express.Router();

function validate(userName) {
  const textRegex = /[A-z ]/;
  return textRegex.test(userName);
}

createUserRouter.get('/', async (req, res) => {
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
    res.render('createUser', { logedUserName, isLogedIn, role });
    console.log('Create user page succesfully rendered');
  } catch (err) {
    console.log('Could\'t render create user page');
    res.status(500).render('error', { message: 'Couldn\'t render create user page' });
  }
});

createUserRouter.post('/', async (req, res) => {
  const { userName, password, role } = req.body;
  const isValid = validate(userName);
  if (!isValid) {
    res.status(422).render('error', { message: 'Invalid input' });
    return;
  }

  try {
    const data = req.body;
    data.userID = shortid.generate().toString();
    const hashSize = 25,
      saltSize = 25,
      hashAlgorithm = 'sha512',
      iterations = 10;
    const pbkdf2 = util.promisify(crypto.pbkdf2);
    const salt = crypto.randomBytes(saltSize);
    const hash = await pbkdf2(password, salt, iterations, hashSize, hashAlgorithm);
    data.salt = salt.toString('base64');
    data.passwordHash = hash.toString('base64');
    data.role = role;
    await insertUser(data);
    console.log(`User ${userName} succesfully inserted in database`);
    res.status(200).redirect('/login');
  } catch (err) {
    console.log('Could\'t insert user into database');
    res.status(500).render('error', { message: 'This username is already taken' });
  }
});

export default createUserRouter;

import express from 'express';
import fs, { promises as fsPromise } from 'fs';
import eol from 'eol';
import logedUser from '../static/otherModuels/logedUser.js';
import userIsAdmin from '../static/otherModuels/userIsAdmin.js';

const mesageRouter = express.Router();

async function fileExists(path) {
  try {
    await fsPromise.access(path);
    return true;
  } catch (err) {
    return false;
  }
}

mesageRouter.get('/:sendUserName?', async (req, res) => {
  const { sendUserName } = req.params;
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

  const path1 = `./static/chats/${sendUserName}~${logedUserName}.txt`;
  const path2 = `./static/chats/${logedUserName}~${sendUserName}.txt`;
  let messagesFilePath;

  const file1Exits = await fileExists(path1);
  const file2Exits = await fileExists(path2);
  if (file1Exits) {
    messagesFilePath = path1;
  } else if (file2Exits) {
    messagesFilePath = path2;
  } else {
    await fsPromise.writeFile(path1, '');
    messagesFilePath = path1;
  }

  fs.readFile(messagesFilePath, { encoding: 'utf8' }, (err, data) => {
    const messagesData = eol.split(data);
    const messages = [];
    messagesData.forEach((message) => {
      const mes = message.split('$');
      messages.push({ user: mes[0], mess: mes[1] });
    });
    if (messages.length !== 1) {
      messages.pop();
    }
    res.render('chatRoomIndividual', {
      logedUserName, isLogedIn, role, sendUserName, messages, messagesFilePath,
    });
  });
});

mesageRouter.post('/:sendUserName', async (req, res) => {
  const { message, path } = req.body;
  const { sendUserName } = req.params;
  const loged = logedUser(req);
  const logedUserName = loged[0];
  const sendMessage = `${logedUserName}$${message}`;
  await fsPromise.appendFile(path, `${sendMessage}\n`);
  res.redirect(`/openChatroom/${sendUserName}`);
});

export default mesageRouter;

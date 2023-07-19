import express from 'express';

const logoutRouter = express.Router();

logoutRouter.post('/', (_req, res) => {
  res.clearCookie('token');
  res.clearCookie('userName');
  res.status(200).redirect('/');
});

export default logoutRouter;

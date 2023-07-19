import jwt from 'jsonwebtoken';
import secret from '../../configuration/config.js';

function logedUser(req) {
  const { token } = req.cookies;
  if (token) {
    try {
      const payload = jwt.verify(token, secret);
      return [payload.username, true];
    } catch (error) {
      return [token, false];
    }
  }
  return [token, false];
}

export default logedUser;

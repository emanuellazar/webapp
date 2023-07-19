import { getAdByID } from '../../db/ads.js';
import { getDataFromOneUser } from '../../db/users.js';
import logedUser from './logedUser.js';

async function adBelongsToLogedUser(req, adID) {
  const logedUserData = logedUser(req);
  const userName = logedUserData[0];
  if (logedUserData[1] === false) {
    return false;
  }
  let adData,
    userData;
  try {
    adData = await getAdByID(adID);
  } catch (err) {
    return false;
  }
  try {
    userData = await getDataFromOneUser(userName);
  } catch (err) {
    return false;
  }
  return adData.userID === userData.userID;
}

export default adBelongsToLogedUser;

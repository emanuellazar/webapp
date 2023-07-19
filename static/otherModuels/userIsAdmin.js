import { getDataFromOneUser } from '../../db/users.js';

async function userIsAdmin(userName) {
  const userData = await getDataFromOneUser(userName);
  return userData.role === 'Admin';
}

export default userIsAdmin;

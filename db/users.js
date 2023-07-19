import pool from './connection.js';

const insertUser = async (user) => {
  const querry = 'INSERT INTO users VALUES (?, ?, ?, ?, ?)';
  return pool.executeQuery(querry, [user.userID, user.userName, user.role,
    user.passwordHash, user.salt], { prepare: true });
};

const getUserData = async () => {
  const query = 'SELECT * FROM users';
  return pool.executeQuery(query);
};

const getFilteredUserData = async (criteria) => {
  const query = 'SELECT * FROM users';
  const res = await pool.executeQuery(query);
  const finalRes = [];
  const regex = new RegExp(criteria, 'gi');
  for (let i = 0; i < res.length; i += 1) {
    const { userName } = res[i];
    if (userName.match(regex)) {
      finalRes.push(res[i]);
    }
  }
  return finalRes;
};

const getDataFromOneUser = async (userName) => {
  const querry = 'select * from users where userName = ?';
  const data = await pool.executeQuery(querry, [userName], { prepare: true });
  return data[0];
};

const getUserNameByUserID = async (userID) => {
  const querry = 'select * from users where userID = ?';
  const data = await pool.executeQuery(querry, [userID], { prepare: true });
  return data[0].userName;
};

const setUserRole = async (userName, role) => {
  const querry = 'update users set role = ? where userName = ?';
  return pool.executeQuery(querry, [role, userName], { prepare: true });
};

export {
  insertUser, getUserData, getDataFromOneUser, getUserNameByUserID, setUserRole,
  getFilteredUserData,
};

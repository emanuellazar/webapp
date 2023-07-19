import fs from 'fs';
import pool from './connection.js';

const createTables = async () => {
  try {
    await pool.executeQuery(
      `CREATE TABLE IF NOT EXISTS users (
        userID varchar(50) primary key,
        userName varchar(50),
        role varchar(20),
        passwordHash varchar(50),
        salt varchar(50),
        unique(userName));`,
    );
    console.log('Table users created successfully');
  } catch (err) {
    console.error(`Error while creating users table: ${err}`);
  }

  try {
    await pool.executeQuery(
      `CREATE TABLE IF NOT EXISTS ads (
        adID varchar(50) primary key,
        varos varchar(50),
        negyed varchar(50),
        felszinterulet int, 
        ar int,
        szobakSzama int, 
        datum varchar(30),
        userID varchar(50),
        FOREIGN KEY (userID) REFERENCES users(userID)
        )`,
    );
    console.log('Table ads created successfully');
  } catch (err) {
    console.error(`Error while creating ads table: ${err}`);
  }

  try {
    await pool.executeQuery(
      `CREATE TABLE IF NOT EXISTS images (
        imageID varchar(50) primary key,
        imagePath varchar(50),
        unique(imagePath),
        adID varchar(50),
        FOREIGN KEY (adID) REFERENCES ads(adID))`,
    );
    console.log('Table images created successfully');
  } catch (err) {
    console.error(`Error while creating images table: ${err}`);
  }
  // ezt em tudtam hova mashova tegyem, mert az elejen kell lefusson, szoval ide tettem
  if (!fs.existsSync('./static/photos')) {
    fs.mkdirSync('./static/photos', { recursive: true });
  }
  if (!fs.existsSync('./static/chats')) {
    fs.mkdirSync('./static/chats', { recursive: true });
  }
};

export default createTables;

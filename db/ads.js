import pool from './connection.js';

const insertAd = async (ad) => {
  const querry = 'INSERT INTO ads VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  return pool.executeQuery(
    querry,
    [ad.adID, ad.varos, ad.negyed,
      ad.felszinterulet, ad.ar, ad.szobakSzama, ad.datum, ad.userID],
    { prepare: true },
  );
};

const getAllAds = async () => {
  const query = 'SELECT * FROM ads';
  return pool.executeQuery(query);
};

const getFilteredAds = async (requrements) => {
  let query = 'SELECT * FROM ads';
  const criteria = [];
  let volt = 0;
  if (requrements.varos !== '') {
    criteria.push(requrements.varos);
    query += ' where varos = ?';
    volt = 1;
  }
  if (requrements.negyed !== '') {
    criteria.push(requrements.negyed);
    if (volt === 1) {
      query += ' and';
    } else {
      query += ' where';
    }
    query += ' negyed = ?';
    volt = 1;
  }
  const { minAr } = requrements;
  if (!Number.isNaN(minAr)) {
    criteria.push(requrements.minAr);
    if (volt === 1) {
      query += ' and';
    } else {
      query += ' where';
    }
    query += ' ar >= ?';
    volt = 1;
  }
  const { maxAr } = requrements;
  if (!Number.isNaN(maxAr)) {
    criteria.push(requrements.maxAr);
    if (volt === 1) {
      query += ' and';
    } else {
      query += ' where';
    }
    query += ' ar <= ?';
  }
  return pool.executeQuery(query, criteria);
};

const getAdByID = async (adID) => {
  const query = 'SELECT * FROM ads where ads.adID = ?';
  const result = await pool.executeQuery(query, [adID], { prepare: true });
  return result[0];
};

const deleteAdById = async (adID) => {
  const querry = 'DELETE from ads where adID = ?';
  return pool.executeQuery(querry, [adID], { prepare: true });
};

export {
  getAllAds, getFilteredAds, insertAd, getAdByID, deleteAdById,
};

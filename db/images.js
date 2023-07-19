import pool from './connection.js';

const insertImage = async (data) => {
  const querry = 'INSERT INTO images VALUES (?, ?, ?)';
  return pool.executeQuery(querry, [data.imageID, data.imagePath, data.adID], { prepare: true });
};

const getImagesByID = async (adID) => {
  const query = 'SELECT images.imagePath, images.imageID FROM ads left join images on images.adID = ads.adID where ads.adID = ?';
  const result = await pool.executeQuery(query, [adID], { prepare: true });
  let notEmpty;
  if (result !== []) {
    notEmpty = result[0].imagePath !== null;
  } else {
    notEmpty = false;
  }

  return [result, notEmpty];
};

const getImagePathFromImageID = async (imageID) => {
  const querry = 'SELECT * from images where imageID = ?';
  const result = await pool.executeQuery(querry, [imageID], { prepare: true });
  return result[0].imagePath;
};

const deleteImage = async (imageId) => {
  const querry = 'DELETE from images where imageID = ?';
  return pool.executeQuery(querry, [imageId], { prepare: true });
};

const deleteImages = async (imagesPaths) => {
  const deleteRequests = [];
  const querry = 'DELETE from images where imagePath = ?';
  for (let i = 0; i < imagesPaths.length; i += 1) {
    deleteRequests.push(pool.executeQuery(querry, [imagesPaths[i].imagePath], { prepare: true }));
  }
  await Promise.all(deleteRequests);
};

export {
  insertImage, getImagesByID, deleteImage, getImagePathFromImageID, deleteImages,
};

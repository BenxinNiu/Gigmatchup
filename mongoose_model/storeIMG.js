'use strict';

const config = require('../config');
const Storage=require('@google-cloud/storage');
const CLOUD_BUCKET=config.get('CLOUD_BUCKET');

const storage=Storage({
projectId: config.get('GCLOUD_PROJECT'),
keyFilename: './keyfile.json'
})
const bucket = storage.bucket(CLOUD_BUCKET);

function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

function sendUploadToGCS (req, res, next) {
  if (!req.file) {
    return next();
  }
  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.objectName = gcsname;
    req.file.publicUrl = getPublicUrl(gcsname);
    next();
  });
  stream.end(req.file.buffer);
}

module.exports={
 getURL:getPublicUrl,
 sendUploadToGCS:sendUploadToGCS
}

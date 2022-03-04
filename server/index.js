require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const uploadsMiddleware = require('./uploads-middleware');
const sizeOf = require('image-size');
const https = require('https');

const db = new pg.Pool({ // eslint-disable-line
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username", "createdAt"
      `;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }

  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
      where "username" = $1;
    `;
  const params = [username];

  db.query(sql, params)
    .then(result => {
      const user = result.rows[0];
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      argon2
        .verify(user.hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }

          const payload = {
            users: {
              userId: user.userId,
              username: username
            }
          };

          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          payload.token = token;
          res.status(200).json(payload);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.post('/api/createmoodboard', (req, res, next) => {
  const { userId, title } = req.body;

  if (!userId) {
    throw new ClientError(404, 'invalid user');
  }
  const sql = `
        insert into "moodBoard" ("userId", "title")
        values ($1, $2)
        returning "userId", "moodBoardId", "title", "createdAt"
      `;
  const params = [userId, title];
  db.query(sql, params)
    .then(result => {
      const [moodBoard] = result.rows;
      res.status(200).json(moodBoard);
    })
    .catch(err => next(err));

});

app.get('/api/getmoodboards', (req, res, next) => {
  const userId = 1; // to be removed once tokens are in place no sign in feature yet.
  const sql = `
        SELECT * FROM "moodBoard" WHERE "userId" = $1
      `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      const moodBoards = result.rows;
      res.status(200).json(moodBoards);
    })
    .catch(err => next(err));

});

app.get('/api/getmoodboard/:moodboardId', (req, res, next) => {
  const userId = 1; // to be removed once tokens are in place no sign in feature yet.
  const moodBoardId = req.params.moodboardId;

  if (!moodBoardId) {
    throw new ClientError(404, 'invalid moodBoardId');
  }

  const sql = `
    SELECT * FROM "moodBoard"
    JOIN "moodObject"
    ON "moodBoard"."moodBoardId"="moodObject"."moodBoardId"
    WHERE "userId" = $1 AND "moodObject"."moodBoardId" = $2
  `;
  const params = [userId, moodBoardId];
  db.query(sql, params)
    .then(result => {
      const moodBoards = result.rows;
      res.status(200).json(moodBoards);
    })
    .catch(err => next(err));

});

// upload codes from react-file-uploads

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {

  const { moodBoardId } = req.body;
  if (!moodBoardId) {
    throw new ClientError(400, 'moodboard id is a required field');
  }
  const fileUrl = req.file.location;

  https.get(fileUrl, function (response) {
    const chunks = [];
    response.on('data', function (chunk) {
      chunks.push(chunk);
    }).on('end', function () {
      const buffer = Buffer.concat(chunks);

      // https://github.com/image-size/image-size
      const dimensions = sizeOf(buffer);

      const scale = 0.25;

      const sql = `
            insert into "moodObject" ("url", "moodBoardId"
            , "height", "width")
            values ($1, $2, $3, $4)
            returning *
          `;

      const params = [fileUrl, moodBoardId,
        (dimensions.height * scale), (dimensions.width * scale)];

      db.query(sql, params)
        .then(result => {
          const [newImage] = result.rows;
          res.status(200).json(newImage);
        })
        .catch(err => next(err));
    });
  });

});

// end of file upload code

app.put('/api/mood-object', (req, res, next) => {
  const { moodObject } = req.body;
  if (!moodObject) {
    throw new ClientError(400, 'moodObject is a required field');
  }

  const { height, width, xCoordinates, yCoordinates, moodBoardId, moodObjectId } = moodObject;
  const sql = `
      UPDATE "moodObject"
      SET "height" = $1, "width" = $2, "xCoordinates" = $3, "yCoordinates" = $4
      WHERE "moodBoardId" = $5 AND "moodObjectId" = $6;
    `;

  const params = [height, width, xCoordinates, yCoordinates, moodBoardId, moodObjectId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json({ success: true });
    })
    .catch(err => next(err));

});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

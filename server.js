const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `./configure.env` });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

///mongoose
//connect app to mongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connection);
    // eslint-disable-next-line no-console
    console.log('DB connection successfull');
  });
//schema

//model

// console.log(process.env);
const app = require('./app');

const port = process.env.PORT || 8000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app running in port${port}`);
});

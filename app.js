const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser")
const layout = require("./views/layout")
const { db , Page, User } = require('./models');
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/users');

db.authenticate()
  .then(() => {
    console.log('connected to the database');
  })

const app = express();
app.use(morgan("dev"));
app.use(express.static(__dirname + "/stylesheets"));
app.use(bodyParser.urlencoded({extended: false}))
app.use('/wiki', wikiRouter);


app.get("/", (req, res) =>{
  res.redirect('/wiki');
})

const init = async () => {
  // await Page.sync();
  // await User.sync();
  await db.sync({force: true});

  const PORT = 5432;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
  });
}
init();





const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

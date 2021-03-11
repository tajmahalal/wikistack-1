const router = require("express").Router();
const {Page, User} = require("../models");
const {userList, userPages} = require("../views");
const wikipage = require("../views/wikipage");
const index = require("../views/index");

router.get('/', async (req, res, next)=>{
  try{
    const users = await User.findAll();
    res.send(userList(users));
  }catch(error){next(error)}
})

router.post('/', async (req, res, next) =>{
  try{
  const [user, wasCreated] = await User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  });

  const page = await Page.create(req.body);

  // `setAuthor` returns a Promise! We should await it so we don't redirect before the author is set
  await page.setAuthor(user);

  res.redirect(`/wiki/${page.slug}`);
}catch(error){next(error)}
})

router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const pages = await Page.findAll({
      where: {
        authorId: req.params.userId
      }
    });

    res.send(userPages(user, pages));
  } catch (error) { next(error) }
});

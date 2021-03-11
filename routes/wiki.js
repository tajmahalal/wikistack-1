const router = require("express").Router();
const {Page} = require("../models");
const {addPage} = require("../views");
const wikipage = require("../views/wikipage");
const index = require("../views/index");
const main = require("../views/main");

router.get('/', async(req, res, next) => {
  // res.send(main(Page.findAll()));
  //console.log("------->", main(Page.findAll()));
  let allPages = await Page.findAll();
  //console.log("----->", allPages[0], typeof allPages);
  res.send(main(allPages));
});


router.post('/', async (req, res, next) => {

  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`

  try {
    const page = await Page.create({
      title: req.body.title,
      content: req.body.content
      //author: req.body.author
    });

    // make sure we only redirect *after* our save is complete! Don't forget to `await` the previous step. `create` returns a Promise.
    // res.redirect('/');
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) { next(error) }
});

function generateSlug(title){
  return title.replace(/\s+/g, '_').replace(/\W/g, '');
}

Page.beforeValidate((page)=>{

   page.slug = generateSlug(page.dataValues.title);
})

router.get('/add', (req, res, next) => {
  res.send(addPage());

})

router.get('/:slug', async (req, res, next) => {
  try{
    const page = await Page.findOne({
      where:{
        slug: req.params.slug
      }
    });
    // res.json(page);
    res.send(wikipage(page));

  }catch(error){next(error)};
});

module.exports = router;

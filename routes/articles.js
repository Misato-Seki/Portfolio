// Import modules
const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

// Routing

// Access to the "All" page
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({
      createdAt: 'desc'
  });
  res.render('articles/blog', { articles : articles });
});

// Access to the 'New' page
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
})
// Access to the 'Edit' page
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
})
// Access to the 'Article' page
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) {
        res.redirect('/');
    } else {
        res.render('articles/show', { article: article});
    }
})

// New
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
  }, saveArticleAndRedirect('new'))

// Edit
router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

// Delete 
router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }

// Export module
module.exports = router;
import Article from '../models/article';
import Tag from '../models/tag';
/**
 * Load Article and append to req.
 */
function load(req, res, next, id) {
  Article.get(id).then((Article) => {
    req.Article = Article;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get Article
 * @returns {Article}
 */
function get(req, res) {
  return res.json(req.Article);
}

/**
 * Create new Article
 * @property {string} req.body.Articlename - The Articlename of Article.
 * @property {string} req.body.mobileNumber - The mobileNumber of Article.
 * @returns {Article}
 */
function create(req, res, next) {
  const article = new Article({
    title: req.body.title,
    link: req.body.link,
    Articlename: req.body.Articlename
  });

  var tagID = req.body.tagID , tagName = req.body.tagName;

  article.saveAsync()
    .then((savedArticle) => {
      if(tagID){
        Tag.get(tagID).then(tag => {
          tag.article.push(savedArticle._id);
          tag.saveAsync().then(model => res.json(model))
        });
        savedArticle.tag = tagID;
        savedArticle.saveAsync().then(model => res.json(model))
      } else {
        const tag = new Tag({
          name:tagName,
          article:[savedArticle._id]
        })

        tag.saveAsync()
          .then(model => {
            savedArticle.tag = model._id
            savedArticle.saveAsync()
              .then(model => res.json(model))
          })
      }
      
    })
    .error((e) => next(e));
}

/**
 * Update existing Article
 * @property {string} req.body.Articlename - The Articlename of Article.
 * @property {string} req.body.mobileNumber - The mobileNumber of Article.
 * @returns {Article}
 */
function update(req, res, next) {
  const Article = req.Article;
  Article.Articlename = req.body.Articlename;
  Article.mobileNumber = req.body.mobileNumber;

  Article.saveAsync()
    .then((savedArticle) => res.json(savedArticle))
    .error((e) => next(e));
}

/**
 * Get Article list.
 * @property {number} req.query.skip - Number of Articles to be skipped.
 * @property {number} req.query.limit - Limit number of Articles to be returned.
 * @returns {Article[]} 
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Article.list({ limit, skip }).then((Articles) =>	res.json(Articles))
    .error((e) => next(e));
}

/**
 * Delete Article.
 * @returns {Article}
 */
function remove(req, res, next) {
  const Article = req.Article;
  Article.removeAsync()
    .then((deletedArticle) => res.json(deletedArticle))
    .error((e) => next(e));
}

export default { load, get, create, update, list, remove };

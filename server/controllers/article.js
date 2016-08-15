import Article from '../models/article';
import Tag from '../models/tag';
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Article.get(id).then((user) => {
    req.user = user;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get user
 * @returns {Article}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {Article}
 */
function create(req, res, next) {
  const article = new Article({
    title: req.body.title,
    link: req.body.link,
    username: req.body.username
  });

  var tagID = req.body.tagID , tagName = req.body.tagName;

  article.saveAsync()
    .then((savedArticle) => {
      if(tagID){
        Tag.get(tagID).then(tag => {
          tag.article.push(savedArticle._id);
          tag.saveAsync().then(model => res.json(model))
        })
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
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {Article}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.saveAsync()
    .then((savedArticle) => res.json(savedArticle))
    .error((e) => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {Article[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Article.list({ limit, skip }).then((users) =>	res.json(users))
    .error((e) => next(e));
}

/**
 * Delete user.
 * @returns {Article}
 */
function remove(req, res, next) {
  const user = req.user;
  user.removeAsync()
    .then((deletedArticle) => res.json(deletedArticle))
    .error((e) => next(e));
}

export default { load, get, create, update, list, remove };

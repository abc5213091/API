import Tag from '../models/tag';

/**
 * Load tag and append to req.
 */
function load(req, res, next, id) {
  Tag.get(id).then((tag) => {
    req.tag = tag;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get tag
 * @returns {Tag}
 */
function get(req, res) {
  return res.json(req.tag);
}

/**
 * Create new tag
 * @property {string} req.body.tagname - The tagname of tag.
 * @property {string} req.body.mobileNumber - The mobileNumber of tag.
 * @returns {Tag}
 */
function create(req, res, next) {
  const tag = new Tag({
    name: req.body.name,
  });

  tag.saveAsync()
    .then((savedTag) => res.json(savedTag))
    .error((e) => next(e));
}

/**
 * Update existing tag
 * @property {string} req.body.tagname - The tagname of tag.
 * @property {string} req.body.mobileNumber - The mobileNumber of tag.
 * @returns {Tag}
 */
function update(req, res, next) {
  const tag = req.tag;
  tag.tagname = req.body.tagname;
  tag.mobileNumber = req.body.mobileNumber;

  tag.saveAsync()
    .then((savedTag) => res.json(savedTag))
    .error((e) => next(e));
}

/**
 * Get tag list.
 * @property {number} req.query.skip - Number of tags to be skipped.
 * @property {number} req.query.limit - Limit number of tags to be returned.
 * @returns {Tag[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Tag.list({ limit, skip }).then((tags) =>	res.json(tags))
    .error((e) => next(e));
}

/**
 * Delete tag.
 * @returns {Tag}
 */
function remove(req, res, next) {
  const tag = req.tag;
  tag.removeAsync()
    .then((deletedTag) => res.json(deletedTag))
    .error((e) => next(e));
}

export default { load, get, create, update, list, remove };

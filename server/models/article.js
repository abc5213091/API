import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const ArticleSchema = new mongoose.Schema({
  title: String,
  link: String, // 链接
  username: String,
  pv: { type: Number, default: 0 },
  pc: { type: Number, default: 0 },
  state: { type: Number, default: 0 },  //0 未读  1 已读
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  },
  createAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
});


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

ArticleSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createAt = this.updateAt = Date.now()
  }
  else {
    this.updateAt = Date.now()
  }
  next()
})

/**
 * Methods
 */
ArticleSchema.method({
});

/**
 * Statics
 */
ArticleSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((article) => {
        if (article) {
          return article;
        }
        const err = new APIError('No such article exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List articles in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of articles to be skipped.
   * @param {number} limit - Limit number of articles to be returned.
   * @returns {Promise<article[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .populate('tags')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .execAsync();
  }
};

/**
 * @typedef article
 */
export default mongoose.model('Article', ArticleSchema);

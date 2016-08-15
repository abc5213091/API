import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Tag Schema
 */
const TagSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],

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

TagSchema.pre('save', function (next) {
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
TagSchema.method({
});

/**
 * Statics
 */
TagSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((Tag) => {
                if (Tag) {
                    return Tag;
                }
                const err = new APIError('No such Tag exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List Tags in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of Tags to be skipped.
     * @param {number} limit - Limit number of Tags to be returned.
     * @returns {Promise<Tag[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .execAsync();
    }
};

/**
 * @typedef Tag
 */
export default mongoose.model('Tag', TagSchema);

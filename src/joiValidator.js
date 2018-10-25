import _ from 'lodash';
import createError from 'http-errors';
import Joi from 'joi';

function buildSchema(def) {
  let body = {};
  const headers = {};
  let path = {};
  let query = {};

  if (_.has(def, 'query')) {
    query = _.merge(query, def.query);
  }

  if (_.has(def, 'body')) {
    body = _.merge(body, def.body);
  }

  if (_.has(def, 'pagination')) {
    query.offset = Joi.number().integer().default(0)
      .min(0)
      .allow('')
      .error(createError(422, 'Parameter offset must be integer greater then 0'));
    query.limit = Joi.number().integer().default(1000)
      .min(1)
      .max(1000)
      .allow('')
      .error(createError(422, 'Parameter limit must be integer between 1 and 1000'));
  }

  if (_.has(def, 'path')) {
    path = _.merge(path, def.path);
  }

  const res = {};
  if (_.size(body)) {
    res.body = Joi.object().allow(null).keys(body);
  }
  if (_.size(headers)) {
    res.headers = Joi.object().allow(null).keys(headers);
  }
  if (_.size(path)) {
    res.pathParameters = Joi.object().allow(null).keys(path);
  }
  if (_.size(query)) {
    res.queryStringParameters = Joi.object().allow(null).keys(query);
  }

  return res;
}

export default function joiValidator({ schema }) {
  return {
    before: (handler, next) => {
      const res = Joi.validate(
        handler.event,
        buildSchema(schema),
        { allowUnknown: true, stripUnknown: true }
      );
      if (res.error) {
        throw createError(422, res.error.message);
      }
      next();
    },
  };
}

export class Validation {
  static getJoi() {
    return Joi;
  }

  static forbidden(param) {
    return Joi.any().forbidden().error(createError(`Setting of parameter ${param} is forbidden`));
  }

  static boolean(param) {
    return Joi.boolean().optional()
      .error(createError(`Parameter ${param} must be a boolean`));
  }

  static string(param) {
    return Joi.string().optional().allow(null).trim()
      .error(createError(`Parameter ${param} must be a string`));
  }

  static stringMaxLength(param, length) {
    return Joi.string().max(length).optional().allow(null)
      .trim()
      .error(createError(`Parameter ${param} must be a string with max length of ${length}`));
  }

  static stringUri(param) {
    return Joi.string().max(255).optional().allow(null)
      .trim()
      .error(createError(`Parameter ${param} must be a valid uri with max length of 255`));
  }

  static integer(param) {
    return Joi.number().integer().optional().allow(null)
      .error(createError(`Parameter ${param} must be an integer`));
  }

  static object(param) {
    return Joi.object().optional().allow(null)
      .error(createError(`Parameter ${param} must be an object`));
  }

  static enum(param, values) {
    return Joi.string().valid(values).optional()
      .error(createError(`Parameter ${param} must be one of: ${values.join(', ')}`));
  }

  static array(param) {
    return Joi.array().allow(null)
      .error(createError(`Parameter ${param} must be an array`));
  }

  static arrayOfStrings(param) {
    return Joi.array().items(Joi.string()).allow(null)
      .error(createError(`Parameter ${param} must be an array of strings`));
  }
}

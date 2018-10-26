## Event Validation Middleware for Middy

[![Build Status](https://travis-ci.org/keboola/middy-event-validator.svg?branch=master)](https://travis-ci.org/keboola/middy-event-validator)

[Joi](https://github.com/hapijs/joi) powered event validation middleware for [Middy](https://middy.js.org/).

The middleware integrates Joi validation library to validate AWS Lambda events triggered by API Gateway.

Failed validations throw error of `http-errors` instance with status code 422.

### Usage

```javascript
import middy from 'middy';
import eventValidator from '@keboola/middy-event-validator';

export const handler = middy(() => {
  // ...
});

handler
  .use(eventValidator({
    path: {
      id: Joi.string().required()
    },
    body: {
      size: Joi.number().integer()
    },
    pagination: true
  }));
```

The configuration accepts following options:
- `headers` - validation of HTTP headers
- `body` - validation of HTTP body in JSON format
- `path` - validation of path parameters (shortcut for API Gateway's `pathParameters`)
- `query` - validation of query string (shortcut for API Gateway's `queryStringParameters`)
- `pagination: true` - shortcut for two query string parameters `offset` and `limit` validated as numbers. 
  - Default and maximum for `limit` is 1000. It can be changed by a definition: `pagination: { max: 10 }` 


The module also offers a set of validation shortcuts using class `Validation`:

```javascript
import middy from 'middy';
import { eventValidator, Validation } from '@keboola/middy-event-validator';

handler
  .use(eventValidator({
    path: {
      id: Validation.string('id').required()
    }
  }));
```

List of available shortcuts:

- `getJoi()` - returns Joi instance for custom validation
- `forbidden(param)` - setting of the parameter is forbidden
- `boolean(param)` - boolean value
- `string(param)` - string. All string shortcuts promote trimming of trailing white spaces
- `stringMaxLength(param, length)` - string with maximal length
- `integer(param)`
- `object(param)`
- `enum(param, values)`
- `array(param)`
- `arrayOfStrings(param)`

All shortcuts create optional parameters, for required parameters add `.required()`.

## Joi Validator Middleware for Middy

[![Build Status](https://travis-ci.org/keboola/middy-joi-validator.svg?branch=master)](https://travis-ci.org/keboola/middy-joi-validator)

[Joi validation](https://github.com/hapijs/joi) middleware for [Middy](https://middy.js.org/).

The middleware integrates Joi validation library. 

Failed validations throw error of `http-errors` instance with status code 422.

### Usage

```javascript
import middy from 'middy';
import joiValidator from '@keboola/middy-joi-validator';

export const handler = middy(() => {
  throw new createError.UnprocessableEntity();
});

handler
  .use(joiValidator({
    
  }));
```

If the error is not an instance from `http-errors`, the error message in the response is replaced with "Internal Error." and the status code is set to 500.

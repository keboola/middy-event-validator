import createError from 'http-errors';
import middy from 'middy';
import { joiValidator, Validation } from '../joiValidator';

describe('Joi Validation Handler for Middy', () => {
  test('Validation', () => {
    const handler = middy(() => {
      throw new createError.UnprocessableEntity();
    });

    handler
      .use(joiValidator({

      }));

    // run the handler
    handler({}, {}, (_, response) => {
      expect(_).toBe(null);
      expect(response).toEqual({
        statusCode: 422,
        body: '{"errorMessage":"Unprocessable Entity","errorCode":422,"requestId":null}',
      });
    });
  });
});

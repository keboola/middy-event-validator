import Joi from 'joi';
import middy from 'middy';
import eventValidator, { Validation } from '../eventValidator';

describe('Event validation for Middy', () => {
  const handler = middy(() => Promise.resolve('ok'));

  handler
    .use(eventValidator({
      body: {
        id: Validation.string('id').required(),
      },
    }));

  test('Validation fail', () => {
    handler({}, {}, (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('statusCode');
      expect(err.statusCode).toBe(422);
    });
  });

  test('Validation ok', () => {
    handler({
      body: {
        id: 'id',
      },
    }, {}, (_, response) => {
      expect(_).toBe(null);
      expect(response).toBe('ok');
    });
  });
});

const expectOk = res => expect(res.error).toBeNull();

const expectFail = res => expect(res.error).toBeInstanceOf(Error);

const testOk = (rule, value) => expectOk(Joi.validate({ test: value }, { test: rule }));

const testFail = (rule, value) => expectFail(Joi.validate({ test: value }, { test: rule }));

const testMissingOk = rule => expectOk(Joi.validate({ }, { test: rule }));

describe('Validation', () => {
  it('forbidden', () => {
    testFail(Validation.forbidden('t'), 3);
    testMissingOk(Validation.forbidden('t'));
  });

  it('boolean', () => {
    testFail(Validation.boolean('t'), 3);
    testFail(Validation.boolean('t'), 'yes');
    testFail(Validation.boolean('t'), ['x']);
    testFail(Validation.boolean('t'), { x: 'y' });
    testOk(Validation.boolean('t'), 'false');
    testOk(Validation.boolean('t'), false);
    testOk(Validation.boolean('t'), true);
    testMissingOk(Validation.boolean('t'));
  });

  it('string', () => {
    testFail(Validation.string('t'), 3);
    testFail(Validation.string('t'), ['x']);
    testFail(Validation.string('t'), { x: 'y' });
    testOk(Validation.string('t'), 'tdfsdsfds');
    testMissingOk(Validation.string('t'));
  });

  it('stringMaxLength', () => {
    testFail(Validation.stringMaxLength('t', 3), 3);
    testFail(Validation.stringMaxLength('t', 3), ['x']);
    testFail(Validation.stringMaxLength('t', 3), { x: 'y' });
    testFail(Validation.stringMaxLength('t', 3), 'aksfjlsdkfjsdkjflkdsjflkdsjkldsjkl');
    testOk(Validation.stringMaxLength('t', 10), 'tdfsdsfds');
    testMissingOk(Validation.stringMaxLength('t', 2));
  });

  it('integer', () => {
    testFail(Validation.integer('t'), 'fdsfdsf');
    testFail(Validation.integer('t'), ['x']);
    testFail(Validation.integer('t'), { x: 'y' });
    testOk(Validation.integer('t'), 3);
    testMissingOk(Validation.integer('t'));
  });

  it('object', () => {
    testFail(Validation.object('t'), 'fdsfdsf');
    testFail(Validation.object('t'), ['x']);
    testFail(Validation.object('t'), 3);
    testOk(Validation.object('t'), { x: 'y' });
    testMissingOk(Validation.object('t'));
  });

  it('enum', () => {
    testFail(Validation.enum('t', ['y', 'z']), 'fdsfdsf');
    testFail(Validation.enum('t', ['y', 'z']), ['x']);
    testFail(Validation.enum('t', ['y', 'z']), 3);
    testOk(Validation.enum('t', ['y', 'z']), 'y');
    testMissingOk(Validation.enum('t', ['y', 'z']));
  });

  it('array', () => {
    testFail(Validation.array('t'), 'fdsfdsf');
    testFail(Validation.array('t'), { x: 'y' });
    testFail(Validation.array('t'), 3);
    testOk(Validation.array('t'), ['x']);
    testMissingOk(Validation.array('t'));
  });
});

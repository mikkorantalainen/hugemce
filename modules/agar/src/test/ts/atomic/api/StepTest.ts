import { UnitTest } from '@ephox/bedrock-client';
import { assert } from 'chai';

import * as Logger from 'hugemce/agar/api/Logger';
import { Pipeline } from 'hugemce/agar/api/Pipeline';
import { Step } from 'hugemce/agar/api/Step';

UnitTest.asynctest('StepTest', (success, failure) => {

  Pipeline.async('cat', [
    Logger.t(
      '[Basic API: Step.log]\n',
      Step.log('step.test.message')
    ),

    Logger.t(
      '[Basic API: Step.debugging]\n',
      Step.debugging
    ),

    Logger.t(
      '[Basic API: Step.wait]\n',
      Step.wait(5)
    ),

    Logger.t(
      '[Step.predicate]\n',
      Step.predicate((t) => t === 'cat')
    ),

    Logger.t(
      '[Basic API: Step.fail]\n',
      Step.fail('last test')
    )
  ], () => {
    failure('The last test should have failed, so the pipeline should have failed.\n' +
      'Expected: Fake failure: last test'
    );
  }, (err) => {
    const expected = '[Basic API: Step.fail]\n\nFake failure: last test';
    try {
      assert.equal(err, expected, '\nFailure incorrect. \nExpected:\n' + expected + '\nActual: ' + err);
    } catch (e) {
      failure(e);
    }
    success();
  });
});

UnitTest.asynctest('Step.predicate false Test', (success, failure) => {

  Pipeline.async('chicken', [
    Logger.t(
      '[ Predicate false ]',
      Step.predicate((s) => s === 'egg')
    )
  ], () => {
    failure('The last test should have failed, so the pipeline should have failed.\n' +
      'Expected: Fake failure: last test'
    );
  }, (err) => {
    const expected = '[ Predicate false ]\npredicate did not succeed';
    try {
      assert.equal(err, expected, '\nFailure incorrect. \nExpected:\n' + expected + '\nActual: ' + err);
    } catch (e) {
      failure(e);
    }
    success();
  });

});

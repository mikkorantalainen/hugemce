import { Assert, UnitTest } from '@ephox/bedrock-client';

import { SugarElement } from 'hugemce/sugar/api/node/SugarElement';
import * as OnNode from 'hugemce/sugar/api/properties/OnNode';

UnitTest.test('OnNodeTest', () => {
  const element = SugarElement.fromTag('div');

  const addAlpha = OnNode.addClass('alpha');
  const addBeta = OnNode.addClass('beta');
  const removeAll = OnNode.removeClasses([ 'alpha', 'beta' ]);
  const removeAlpha = OnNode.removeClass('alpha');
  const hasAlpha = OnNode.hasClass('alpha');
  const hasBeta = OnNode.hasClass('beta');

  Assert.eq('', false, hasAlpha(element));
  addAlpha(element);
  Assert.eq('', true, hasAlpha(element));
  Assert.eq('', false, hasBeta(element));
  removeAlpha(element);
  Assert.eq('', false, hasAlpha(element));
  addAlpha(element);
  Assert.eq('', true, hasAlpha(element));
  addBeta(element);
  Assert.eq('', true, hasBeta(element));
  removeAll(element);
  Assert.eq('', false, hasAlpha(element));
  Assert.eq('', false, hasBeta(element));
});

import { Assert, UnitTest } from '@ephox/bedrock-client';

import * as Insert from 'hugemce/sugar/api/dom/Insert';
import { SugarElement } from 'hugemce/sugar/api/node/SugarElement';
import * as Fragment from 'hugemce/sugar/api/node/SugarFragment';
import * as Html from 'hugemce/sugar/api/properties/Html';

UnitTest.test('FragmentTest', () => {
  const fragment = Fragment.fromElements([
    SugarElement.fromHtml('<span>Hi</span>'),
    SugarElement.fromTag('br'),
    SugarElement.fromHtml('<p>One</p>')
  ]);

  const container = SugarElement.fromTag('div');
  Insert.append(container, fragment);

  Assert.eq('', '<span>Hi</span><br><p>One</p>', Html.get(container));
});

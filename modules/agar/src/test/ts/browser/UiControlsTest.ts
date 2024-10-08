import { UnitTest } from '@ephox/bedrock-client';
import { Insert, SugarElement } from '@hugemce/sugar';

import * as Assertions from 'hugemce/agar/api/Assertions';
import { Chain } from 'hugemce/agar/api/Chain';
import { Pipeline } from 'hugemce/agar/api/Pipeline';
import * as UiControls from 'hugemce/agar/api/UiControls';

UnitTest.asynctest('UiControlsTest', (success, failure) => {

  const input = SugarElement.fromTag('input');
  const container = SugarElement.fromTag('container');

  Insert.append(container, input);

  Pipeline.async({}, [
    UiControls.sSetValueOn(container, 'input', 'step.value.1'),

    Chain.asStep(input, [
      UiControls.cGetValue,
      Assertions.cAssertEq('Checking that sSetValueOn sets the value and cGetValue reads it', 'step.value.1')
    ]),

    UiControls.sSetValue(input, 'step.value.2'),
    Chain.asStep(input, [
      UiControls.cGetValue,
      Assertions.cAssertEq('Checking that sSetValue sets the value and cGetValue reads it', 'step.value.2')
    ]),

    Chain.asStep(input, [
      UiControls.cSetValue('chain.value.1'),
      UiControls.cGetValue,
      Assertions.cAssertEq('Checking that cSetValue sets the value and cGetValue reads it', 'chain.value.1')
    ])

  ], success, failure);
});

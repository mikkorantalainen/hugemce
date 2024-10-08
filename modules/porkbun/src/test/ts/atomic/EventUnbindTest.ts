import { UnitTest } from '@ephox/bedrock-client';
import { Fun } from '@hugemce/katamari';

import { Event } from 'hugemce/porkbun/Event';

UnitTest.test('EventUnbindTest', () => {
  const event = Event([]);

  const first = () => event.unbind(first);
  const second = Fun.noop;

  event.bind(first);
  event.bind(second);

  // ensure unbind during trigger does not cause problems
  event.trigger();
});

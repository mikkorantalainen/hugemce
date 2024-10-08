import { Singleton } from '@hugemce/katamari';
import { assert } from 'chai';

const assertSingletonValueIsSet = <T>(singleton: Singleton.Value<T>, message: string): void =>
  assert.isTrue(singleton.isSet(), message);

export { assertSingletonValueIsSet };

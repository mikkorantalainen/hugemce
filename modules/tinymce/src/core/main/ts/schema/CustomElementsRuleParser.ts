import { Arr } from '@hugemce/katamari';

import * as SchemaUtils from './SchemaUtils';

export interface CustomElementRule {
  readonly cloneName: 'div' | 'span';
  readonly name: string;
}

export const parseCustomElementsRules = (value: string): CustomElementRule[] => {
  const customElementRegExp = /^(~)?(.+)$/;
  return Arr.bind(SchemaUtils.split(value, ','), (rule) => {
    const matches = customElementRegExp.exec(rule);
    if (matches) {
      const inline = matches[1] === '~';
      const cloneName = inline ? 'span' : 'div';
      const name = matches[2];

      return [{ cloneName, name }];
    } else {
      return [];
    }
  });
};

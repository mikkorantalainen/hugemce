import { UnitTest } from '@ephox/bedrock-client';
import { SugarElement } from '@hugemce/sugar';

import * as ApproxStructure from 'hugemce/agar/api/ApproxStructure';
import * as Assertions from 'hugemce/agar/api/Assertions';

UnitTest.test('Approx Structures Tutorial Test', () => {
  const html = '<div data-key="test-1" selected="double" class="test1 root" style="display: block;">' +
    '<div selected="true">' +
    '<span data-hugemce-id="blah" class="disabled">span</span>' +
    '</div>' +
    'words' +
    '</div>';

  const check = (expected, input): void => {
    const target = SugarElement.fromHtml(input);
    Assertions.assertStructure('Test', expected, target);
  };

  const structure = ApproxStructure.build((s, str, arr) =>
    s.element('div', {
      classes: [
        arr.has('test1'),
        arr.hasPrefix('tes')
      ],
      attrs: {
        selected: str.is('double'),
        car: str.none('Car should not be there')
      },
      styles: {
        display: str.is('block')
      },
      children: [
        s.element('div', {
          attrs: {
            selected: str.is('true')
          },
          children: [
            s.element('span', {
              attrs: {
                'data-hugemce-id': str.startsWith('bl')
              },
              classes: [
                arr.has('disabled'),
                arr.not('enabled')
              ],
              html: str.is('span')
            })
          ]
        }),
        s.text(str.is('words'))
      ]
    }));

  check(structure, html);
});

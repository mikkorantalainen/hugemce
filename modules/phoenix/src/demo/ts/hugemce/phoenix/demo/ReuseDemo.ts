import { Arr, Optional } from '@hugemce/katamari';
import { Css, DomEvent, Insert, SelectorFind, SugarElement, SugarNode } from '@hugemce/sugar';

import * as DomWrapping from 'hugemce/phoenix/api/dom/DomWrapping';

const editor = SugarElement.fromTag('div');
Css.setAll(editor, {
  width: '400px',
  height: '300px',
  border: '1px solid blue'
});
const hugemceUi = SelectorFind.first('#hugemce-ui').getOrDie();

DomEvent.bind(SugarElement.fromDom(document), 'keydown', (event) => {
  if (event.raw.keyCode === 13) {
    Optional.from(window.getSelection()).each((selection) => {
      if (selection.rangeCount > 0) {
        const anchorNode = SugarElement.fromDom(selection.anchorNode as Node);
        const focusNode = SugarElement.fromDom(selection.focusNode as Node);
        const spans = DomWrapping.reuse(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset, (elem) => {
          return SugarNode.name(elem) === 'span';
        }, () => {
          return DomWrapping.nu(SugarElement.fromTag('span'));
        });

        Arr.each(spans, (span) => {
          Css.set(span, 'border-bottom', '1px solid red');
        });
      }
    });
  }
});

Insert.append(hugemceUi, editor);

editor.dom.innerHTML = 'Hello <span style="background-color: blue;">world</span> again<br/>, this is Earth.';

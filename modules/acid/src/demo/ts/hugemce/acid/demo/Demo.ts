import { Channels, Debugging, Gui, GuiFactory } from '@hugemce/alloy';
import { Fun, Optional, Type } from '@hugemce/katamari';
import { Class, DomEvent, Insert, SugarElement } from '@hugemce/sugar';

import { Untranslated } from 'hugemce/acid/alien/I18n';
import * as ColourPicker from 'hugemce/acid/gui/ColourPicker';

import { strings } from '../../../../i18n/en';

const gui = Gui.create();
const body = SugarElement.fromDom(document.body);
Class.add(gui.element, 'gui-root-demo-container');
Insert.append(body, gui.element);

DomEvent.bind(SugarElement.fromDom(document), 'mouseup', (evt) => {
  if (evt.raw.button === 0) {
    gui.broadcastOn([ Channels.mouseReleased() ], {
      target: evt.target
    });
  }
});

const fakeTranslate = (key: Untranslated): string => {
  if (Type.isString(key)) {
    return Optional.from(strings[key]).getOrThunk(() => {
    // eslint-disable-next-line no-console
      console.error('Missing translation for ' + key);
      return key;
    });
  } else {
    return 'Untranslated, complex string';
  }
};

const colourPickerFactory = ColourPicker.makeFactory(fakeTranslate, Fun.identity);

const colourPicker = GuiFactory.build(colourPickerFactory.sketch({
  dom: {
    tag: 'div',
    classes: [ 'example-colour-picker' ]
  }
}));
gui.add(colourPicker);
Debugging.registerInspector('htmldisplay', gui);

import { Fun } from '@hugemce/katamari';
import { Focus } from '@hugemce/sugar';

import { Focusing } from '../../api/behaviour/Focusing';
import { AlloyComponent } from '../../api/component/ComponentApi';
import * as AlloyTriggers from '../../api/events/AlloyTriggers';

const hoverEvent = 'alloy.item-hover';
const focusEvent = 'alloy.item-focus';
const toggledEvent = 'alloy.item-toggled';

const onHover = (item: AlloyComponent): void => {
  // Firstly, check that the focus isn't already inside the item. This
  // is to handle situations like widgets where the widget is inside the item
  // and it has the focus, so as you slightly adjust the mouse, you don't
  // want to lose focus on the widget. Note, that because this isn't API based
  // (i.e. we are manually searching for focus), it may not be that flexible.
  if (Focus.search(item.element).isNone() || Focusing.isFocused(item)) {
    if (!Focusing.isFocused(item)) {
      Focusing.focus(item);
    }
    AlloyTriggers.emitWith(item, hoverEvent, { item });
  }
};

const onFocus = (item: AlloyComponent): void => {
  AlloyTriggers.emitWith(item, focusEvent, { item });
};

const onToggled = (item: AlloyComponent, state: boolean): void => {
  AlloyTriggers.emitWith(item, toggledEvent, { item, state });
};

const hover = Fun.constant(hoverEvent);
const focus = Fun.constant(focusEvent);
const toggled = Fun.constant(toggledEvent);

export {
  hover,
  focus,
  toggled,
  onHover,
  onFocus,
  onToggled
};

import { SugarElement } from '@hugemce/sugar';

// TODO: Move into shared library (eg agar)
const fakeEvent = (elm: SugarElement<Node>, name: string): void => {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent(name, true, true);
  elm.dom.dispatchEvent(evt);
};

export {
  fakeEvent
};

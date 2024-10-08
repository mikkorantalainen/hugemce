import { Arr, Optional } from '@hugemce/katamari';
import { Class, SugarElement, Value } from '@hugemce/sugar';

import * as Behaviour from 'hugemce/alloy/api/behaviour/Behaviour';
import { Reflecting } from 'hugemce/alloy/api/behaviour/Reflecting';
import { Streaming } from 'hugemce/alloy/api/behaviour/Streaming';
import * as DomFactory from 'hugemce/alloy/api/component/DomFactory';
import * as Attachment from 'hugemce/alloy/api/system/Attachment';
import * as Gui from 'hugemce/alloy/api/system/Gui';
import { Container } from 'hugemce/alloy/api/ui/Container';
import { Input } from 'hugemce/alloy/api/ui/Input';
import * as HtmlDisplay from 'hugemce/alloy/demo/HtmlDisplay';

export default (): void => {
  const gui = Gui.create();
  const body = SugarElement.fromDom(document.body);
  Class.add(gui.element, 'gui-root-demo-container');
  Attachment.attachSystem(body, gui);

  HtmlDisplay.section(
    gui,
    'Change the entries by entering data into the input field. Use a comma delimiter for multiple entries',
    Container.sketch({
      components: [
        Input.sketch({
          inputBehaviours: Behaviour.derive([
            Streaming.config({
              stream: {
                mode: 'throttle',
                delay: 2000
              },
              onStream: (comp) => {
                comp.getSystem().broadcastOn([ 'reflecting-channel' ], {
                  items: Value.get(comp.element).split(',')
                });
              }
            })
          ]),
          data: 'dog,cat,elephant'
        }),

        {
          dom: DomFactory.fromHtml('<h2>Entries</h2>')
        },
        Container.sketch({
          dom: {
            tag: 'ol'
          },
          components: [ ],

          containerBehaviours: Behaviour.derive([
            Reflecting.config({
              channel: 'reflecting-channel',
              renderComponents: (data: { items: string [] }) => Arr.map(data.items, (d) => ({
                dom: { tag: 'li', innerHtml: d }
              })),
              updateState: (comp, data) => Optional.some<any>(data),
              initialData: {
                items: [ 'dog', 'cat', 'elephant' ]
              }
            })
          ])
        })
      ]
    })
  );
};

import { Optional } from '@hugemce/katamari';
import { PlatformDetection } from '@hugemce/sand';
import { Class, Css, SugarElement, SugarPosition } from '@hugemce/sugar';

import * as Behaviour from 'hugemce/alloy/api/behaviour/Behaviour';
import { Dragging } from 'hugemce/alloy/api/behaviour/Dragging';
import { Unselecting } from 'hugemce/alloy/api/behaviour/Unselecting';
import * as DragCoord from 'hugemce/alloy/api/data/DragCoord';
import * as Attachment from 'hugemce/alloy/api/system/Attachment';
import * as Gui from 'hugemce/alloy/api/system/Gui';
import { Button } from 'hugemce/alloy/api/ui/Button';
import { Container } from 'hugemce/alloy/api/ui/Container';
import * as HtmlDisplay from 'hugemce/alloy/demo/HtmlDisplay';

export default (): void => {
  const gui = Gui.create();
  const body = SugarElement.fromDom(document.body);
  Class.add(gui.element, 'gui-root-demo-container');
  // Css.set(gui.element, 'direction', 'rtl');

  Attachment.attachSystem(body, gui);
  Css.set(body, 'margin-bottom', '2000px');

  const snapData = {
    getSnapPoints: () => {
      return [
        Dragging.snap({
          sensor: DragCoord.fixed(300, 10),
          range: SugarPosition(1000, 30),
          output: DragCoord.fixed(Optional.none<number>(), Optional.some(10))
        }),

        Dragging.snap({
          sensor: DragCoord.offset(300, 500),
          range: SugarPosition(40, 40),
          output: DragCoord.absolute(Optional.some(300), Optional.some(500))
        })
      ];
    },
    leftAttr: 'data-drag-left',
    topAttr: 'data-drag-top'
  };

  HtmlDisplay.section(
    gui,
    'This button is a <code>button</code> that can be dragged',
    Container.sketch({
      components: [
        Container.sketch({
          dom: {
            styles: {
              position: 'fixed',
              width: '100px',
              height: '20px',
              left: '300px',
              top: '10px',
              background: 'blue'
            },
            innerHtml: 'A fixed dock'
          }
        }),
        Container.sketch({
          dom: {
            styles: {
              position: 'absolute',
              width: '10px',
              height: '10px',
              left: '300px',
              top: '500px',
              background: 'red'
            }
          }
        }),
        Button.sketch({
          dom: {
            tag: 'span',
            innerHtml: 'Drag me!',
            styles: {
              padding: '10px',
              display: 'inline-block',
              background: '#333',
              color: '#fff'
            }
          },

          buttonBehaviours: Behaviour.derive([
            Dragging.config({
              mode: PlatformDetection.detect().deviceType.isTouch() ? 'touch' : 'mouse',
              blockerClass: 'blocker',
              snaps: snapData
            }),
            Unselecting.config({ })
          ]),
          eventOrder: {
            // Because this is a button, allow dragging. It will stop clicking.
            mousedown: [ 'dragging', 'alloy.base.behaviour' ]
          }
        })
      ]
    })
  );

};

import { PlatformDetection } from '@hugemce/sand';
import { Class, Css, SugarElement, SugarPosition, Traverse } from '@hugemce/sugar';

import * as Behaviour from 'hugemce/alloy/api/behaviour/Behaviour';
import { Dragging } from 'hugemce/alloy/api/behaviour/Dragging';
import { Unselecting } from 'hugemce/alloy/api/behaviour/Unselecting';
import { AlloyComponent } from 'hugemce/alloy/api/component/ComponentApi';
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

  const onDrag = (comp: AlloyComponent, targetElement: SugarElement<Node>, delta: SugarPosition) => {
    Traverse.parent(targetElement).bind(Traverse.parent).bind(Traverse.firstChild).each((box) => {
      Css.getRaw(box, 'height').each((h) => {
        const parsedHeight = parseInt(h, 10);
        const newHeight = parsedHeight + delta.top;
        Css.set(box, 'height', newHeight + 'px');
      });
    });
  };

  HtmlDisplay.section(
    gui,
    'Drag the X to resize the box',
    Container.sketch({
      dom: {
        styles: {
          width: '500px'
        }
      },
      components: [
        Container.sketch({
          dom: {
            tag: 'div',
            styles: {
              background: 'blue',
              height: '200px',
              border: '2px solid black'
            }
          }
        }),
        Container.sketch({
          dom: {
            styles: {
              position: 'relative'
            }
          },
          components: [
            Button.sketch({
              dom: {
                tag: 'span',
                innerHtml: 'X',
                styles: {
                  position: 'absolute',
                  right: '0px',
                  bottom: '0px',
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
                  repositionTarget: false,
                  onDrag
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
      ]
    })
  );

};

import { GeneralSteps, Mouse, Step, Waiter } from '@hugemce/agar';
import { UnitTest } from '@ephox/bedrock-client';

import * as Behaviour from 'hugemce/alloy/api/behaviour/Behaviour';
import { Streaming } from 'hugemce/alloy/api/behaviour/Streaming';
import * as GuiFactory from 'hugemce/alloy/api/component/GuiFactory';
import * as AlloyTriggers from 'hugemce/alloy/api/events/AlloyTriggers';
import * as GuiSetup from 'hugemce/alloy/api/testhelpers/GuiSetup';
import { Container } from 'hugemce/alloy/api/ui/Container';

UnitTest.asynctest('StreamingTest', (success, failure) => {

  GuiSetup.setup((store, _doc, _body) => GuiFactory.build(
    Container.sketch({
      dom: {
        tag: 'input'
      },
      containerBehaviours: Behaviour.derive([
        Streaming.config({
          stream: {
            mode: 'throttle',
            delay: 200
          },
          event: 'click',
          cancelEvent: 'cancel.stream',
          onStream: store.adder('onStream')
        })
      ])
    })
  ), (_doc, _body, gui, component, store) => [
    GeneralSteps.sequenceRepeat(
      5,
      GeneralSteps.sequence([
        Mouse.sClickOn(gui.element, 'input')
      ])
    ),

    Step.wait(220),
    store.sAssertEq('Should have only fired one event', [ 'onStream' ]),

    GeneralSteps.sequenceRepeat(
      5,
      GeneralSteps.sequence([
        Mouse.sClickOn(gui.element, 'input')
      ])
    ),
    Step.wait(220),
    store.sAssertEq('Should have only fired two events', [ 'onStream', 'onStream' ]),

    // Wait long enough to ensure everything is gone, and then test "cancelling"
    store.sClear,
    Step.wait(220),
    Mouse.sClickOn(gui.element, 'input'),
    Step.wait(10),
    Step.sync(() => {
      AlloyTriggers.emit(component, 'cancel.stream');
    }),
    Waiter.sTryUntil('', store.sAssertEq('Event should have been cancelled, so nothing should be in store', [ ]))
  ], success, failure);
});

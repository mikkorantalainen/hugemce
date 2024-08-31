import { Keyboard, Keys, Logger, Pipeline, Step } from '@hugemce/agar';
import { UnitTest } from '@hugemce/bedrock-client';

import * as Behaviour from 'hugemce/alloy/api/behaviour/Behaviour';
import { Focusing } from 'hugemce/alloy/api/behaviour/Focusing';
import { Keying } from 'hugemce/alloy/api/behaviour/Keying';
import * as GuiFactory from 'hugemce/alloy/api/component/GuiFactory';
import * as AlloyEvents from 'hugemce/alloy/api/events/AlloyEvents';
import * as GuiSetup from 'hugemce/alloy/api/testhelpers/GuiSetup';
import { Container } from 'hugemce/alloy/api/ui/Container';

UnitTest.asynctest('ExecutingKeyingTest', (success, failure) => {

  const sTestDefault = Logger.t(
    'Default execution',
    Step.async((next, die) => {

      GuiSetup.setup((store, _doc, _body) => GuiFactory.build(
        Container.sketch({
          dom: {
            classes: [ 'executing-keying-test' ],
            styles: {

            }
          },
          containerBehaviours: Behaviour.derive([
            Focusing.config({ }),
            Keying.config({
              mode: 'execution'
            })
          ]),
          events: AlloyEvents.derive([
            AlloyEvents.runOnExecute(store.adder('event.execute'))
          ])
        })
      ), (doc, body, _gui, component, store) => [
        GuiSetup.mSetupKeyLogger(body),
        Step.sync(() => {
          Focusing.focus(component);
        }),
        store.sAssertEq('Initially empty', [ ]),
        Keyboard.sKeydown(doc, Keys.enter(), { }),
        store.sAssertEq('Post enter', [ 'event.execute' ]),
        GuiSetup.mTeardownKeyLogger(body, [ ])
      ], next, die);
    })
  );

  const sTestConfiguration = Logger.t(
    'Testing ctrl+enter and space execute',
    Step.async((next, die) => {
      GuiSetup.setup((store, _doc, _body) => GuiFactory.build(
        Container.sketch({
          dom: {
            classes: [ 'executing-keying-test' ],
            styles: {

            }
          },
          containerBehaviours: Behaviour.derive([
            Focusing.config({ }),
            Keying.config({
              mode: 'execution',
              useControlEnter: true,
              useEnter: false,
              useSpace: true
            })
          ]),
          events: AlloyEvents.derive([
            AlloyEvents.runOnExecute(store.adder('event.execute'))
          ])
        })
      ), (doc, body, _gui, component, store) => [
        GuiSetup.mSetupKeyLogger(body),
        Step.sync(() => {
          Focusing.focus(component);
        }),
        store.sAssertEq('Initially empty', [ ]),
        Keyboard.sKeydown(doc, Keys.enter(), { }),
        store.sAssertEq('Post enter', [ ]),
        Keyboard.sKeydown(doc, Keys.space(), { }),
        store.sAssertEq('Post space', [ 'event.execute' ]),
        Keyboard.sKeydown(doc, Keys.enter(), { ctrl: true }),
        store.sAssertEq('Post ctrl+enter', [ 'event.execute', 'event.execute' ]),
        GuiSetup.mTeardownKeyLogger(body, [
          // Enter was not handled
          'keydown.to.body: 13'
        ])
      ], next, die);
    })
  );

  Pipeline.async({ }, [
    sTestDefault,
    sTestConfiguration
  ], success, failure);
});

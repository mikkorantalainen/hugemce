import { FocusTools, Keyboard, Keys } from '@hugemce/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Arr, Future, Id, Optional, Result } from '@hugemce/katamari';

import * as Behaviour from 'hugemce/alloy/api/behaviour/Behaviour';
import { Focusing } from 'hugemce/alloy/api/behaviour/Focusing';
import { AlloyComponent } from 'hugemce/alloy/api/component/ComponentApi';
import * as GuiFactory from 'hugemce/alloy/api/component/GuiFactory';
import * as GuiSetup from 'hugemce/alloy/api/testhelpers/GuiSetup';
import { Container } from 'hugemce/alloy/api/ui/Container';
import { TieredData, tieredMenu as TieredMenu } from 'hugemce/alloy/api/ui/TieredMenu';
import { Typeahead } from 'hugemce/alloy/api/ui/Typeahead';
import { TestItem } from 'hugemce/alloy/test/dropdown/TestDropdownMenu';
import * as TestDropdownMenu from 'hugemce/alloy/test/dropdown/TestDropdownMenu';
import * as Sinks from 'hugemce/alloy/test/Sinks';
import TestTypeaheadSteps from 'hugemce/alloy/test/typeahead/TestTypeaheadSteps';

UnitTest.asynctest('Browser Test: .ui.typeahead.TypeaheadSelectsOverTest', (success, failure) => {
  const typeaheadMarkers = {
    openClass: 'test-typeahead-open'
  };

  GuiSetup.setup((store, _doc, _body) => {
    const sink = Sinks.relativeSink();

    const fetch = (_input: AlloyComponent): Future<Optional<TieredData>> => {
      const future = Future.pure<TestItem[]>([
        { type: 'item', data: { value: 'alpha', meta: { text: 'Alpha' }}},
        { type: 'item', data: { value: 'beta', meta: { text: 'Beta' }}},
        { type: 'item', data: { value: 'gamma', meta: { text: 'Gamma' }}}
      ]);

      return future.map((items) => {
        const menu = TestDropdownMenu.renderMenu({
          value: Id.generate('single-menu-value'),
          items: Arr.map(items, TestDropdownMenu.renderItem)
        });
        return Optional.some(TieredMenu.singleData('overlord', menu));
      });
    };

    return GuiFactory.build(
      Container.sketch({
        components: [
          GuiFactory.premade(sink),

          Typeahead.sketch({
            uid: 'test-type-with-selectover',
            inputClasses: [ 'with-selectover' ],
            minChars: 2,
            model: {
              selectsOver: true
            },
            markers: typeaheadMarkers,
            initialData: {
              value: 'initial-value',
              meta: {
                text: 'initial-value'
              }
            },
            fetch,
            lazySink: (c) => {
              TestDropdownMenu.assertLazySinkArgs('input', 'with-selectover', c);
              return Result.value(sink);
            },
            parts: {
              menu: TestDropdownMenu.part(store)
            }
          }),

          Typeahead.sketch({
            uid: 'test-type-without-selectover',
            inputClasses: [ 'without-selectover' ],
            minChars: 2,
            model: {
              selectsOver: false
            },
            markers: typeaheadMarkers,
            initialData: {
              value: 'initial-value',
              meta: {
                text: 'initial-value'
              }
            },
            fetch,
            lazySink: (c) => {
              TestDropdownMenu.assertLazySinkArgs('input', 'without-selectover', c);
              return Result.value(sink);
            },
            parts: {
              menu: TestDropdownMenu.part(store)
            }
          })
        ],

        containerBehaviours: Behaviour.derive([
          Focusing.config({ })
        ])
      })
    );

  }, (doc, _body, gui, _component, _store) => {
    const testWithSelector = () => {
      const typeahead = gui.getByUid('test-type-with-selectover').getOrDie();

      const steps = TestTypeaheadSteps(doc, gui, typeahead);

      return [
        FocusTools.sSetFocus('Focusing typeahead with selectover', gui.element, '.with-selectover'),
        FocusTools.sSetActiveValue(doc, 'al'),
        steps.sTriggerInputEvent('Simulate typing to show menu with "al"'),
        steps.sWaitForMenu('"Typing" should activate menu'),
        steps.sAssertValue('Checking non-matching typeahead menu not changing value', 'al'),
        Keyboard.sKeyup(doc, Keys.escape(), { }),
        steps.sWaitForNoMenu('Pressing escape should dismiss menu'),

        FocusTools.sSetActiveValue(doc, 'Al'),
        steps.sTriggerInputEvent('Simulate typing to show menu with "Al"'),
        steps.sWaitForMenu('"Typing" should activate menu and select over because of matching text'),

        steps.sAssertValue('Should change to "Alpha" with it selected over', 'Alpha'),
        steps.sAssertTextSelection('Selects Over Al|pha|', 'Al'.length, 'Alpha'.length),
        Keyboard.sKeyup(doc, Keys.escape(), { }),
        steps.sWaitForNoMenu('Pressing escape should dismiss menu for end of this part of test')
      ];
    };

    const testWithoutSelector = () => {
      const typeahead = gui.getByUid('test-type-without-selectover').getOrDie();

      const steps = TestTypeaheadSteps(doc, gui, typeahead);

      return [
        FocusTools.sSetFocus('Focusing typeahead without selectover', gui.element, '.without-selectover'),
        FocusTools.sSetActiveValue(doc, 'al'),
        steps.sTriggerInputEvent('Simulate typing to show menu with "al"'),
        steps.sWaitForMenu('"Typing" should activate menu'),
        steps.sAssertValue('Checking non-matching typeahead menu not changing value', 'al'),
        Keyboard.sKeyup(doc, Keys.escape(), { }),
        steps.sWaitForNoMenu('Pressing escape should dismiss menu'),

        FocusTools.sSetActiveValue(doc, 'Al'),
        steps.sTriggerInputEvent('Simulate typing to show menu with "Al"'),
        steps.sWaitForMenu('"Typing" should activate menu and not select over because the setting is false'),

        steps.sAssertValue('Should keep it as "Al" with selection at end of input', 'Al'),
        steps.sAssertTextSelection('No select over. So "Al"', 'Al'.length, 'Al'.length)
      ];
    };

    return [
      GuiSetup.mAddStyles(doc, [
        '.selected-item { background-color: #cadbee; }'
      ]),
      ...testWithSelector(),
      ...testWithoutSelector(),
      GuiSetup.mRemoveStyles
    ];
  }, success, failure);
});

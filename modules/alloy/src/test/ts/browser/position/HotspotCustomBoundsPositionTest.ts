import { Assertions, Chain, NamedChain } from '@hugemce/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Fun } from '@hugemce/katamari';
import { Css } from '@hugemce/sugar';

import * as Boxes from 'hugemce/alloy/alien/Boxes';
import { AlloyComponent } from 'hugemce/alloy/api/component/ComponentApi';
import * as GuiFactory from 'hugemce/alloy/api/component/GuiFactory';
import * as GuiSetup from 'hugemce/alloy/api/testhelpers/GuiSetup';
import { Button } from 'hugemce/alloy/api/ui/Button';
import { Container } from 'hugemce/alloy/api/ui/Container';
import * as Layout from 'hugemce/alloy/positioning/layout/Layout';
import * as ChainUtils from 'hugemce/alloy/test/ChainUtils';
import * as PositionTestUtils from 'hugemce/alloy/test/PositionTestUtils';
import * as Sinks from 'hugemce/alloy/test/Sinks';

UnitTest.asynctest('HotspotPositionTest', (success, failure) => {

  GuiSetup.setup((_store, _doc, _body) => {
    const hotspot = GuiFactory.build(
      Button.sketch({
        action: Fun.noop,
        dom: {
          styles: {
            position: 'absolute',
            left: '100px',
            top: '200px'
          },
          innerHtml: 'Hotspot',
          tag: 'button'
        },
        uid: 'hotspot'
      })
    );

    return GuiFactory.build(
      Container.sketch({
        components: [
          GuiFactory.premade(Sinks.fixedSink()),
          GuiFactory.premade(Sinks.relativeSink()),
          GuiFactory.premade(Sinks.popup()),
          GuiFactory.premade(hotspot)
        ]
      })
    );

  }, (_doc, _body, gui, _component, _store) => {
    const cSetupAnchor = Chain.mapper((hotspot) => ({
      type: 'hotspot',
      hotspot,
      layouts: {
        onLtr: () => [ Layout.northeast, Layout.southeast ],
        onRtl: () => [ Layout.northwest, Layout.southwest ]
      }
    }));

    const cAssertLayoutDirection = (direction: 'top' | 'bottom'): Chain<any, any> => Chain.op((data: { popup: AlloyComponent }) => {
      const popup = data.popup.element;
      // Swap the direction name, as the style used is opposite
      const style = direction === 'top' ? 'bottom' : 'top';
      Assertions.assertEq(`Assert layout direction is ${direction}`, true, Css.getRaw(popup, style).isSome());
    });

    const win = Boxes.win();
    const bounds100PixelsFromTop = Boxes.bounds(win.x, win.y + 100, win.width, win.height - 100);

    return [
      Chain.asStep({}, [
        NamedChain.asChain([
          ChainUtils.cFindUids(gui, {
            fixed: 'fixed-sink',
            relative: 'relative-sink',
            popup: 'popup',
            hotspot: 'hotspot'
          }),

          NamedChain.direct('hotspot', cSetupAnchor, 'anchor'),

          PositionTestUtils.cTestSinkWithinBounds('Relative, not scrolled', 'relative', Fun.constant(win)),
          cAssertLayoutDirection('top'),
          PositionTestUtils.cTestSinkWithinBounds('Fixed, not scrolled', 'fixed', Fun.constant(win)),
          cAssertLayoutDirection('top'),

          PositionTestUtils.cTestSinkWithinBounds('Relative, bounds 50px from top', 'relative', Fun.constant(bounds100PixelsFromTop)),
          cAssertLayoutDirection('bottom'),
          PositionTestUtils.cTestSinkWithinBounds('Fixed, bounds 50px from top', 'fixed', Fun.constant(bounds100PixelsFromTop)),
          cAssertLayoutDirection('bottom')
        ])
      ])
    ];
  }, success, failure);
});

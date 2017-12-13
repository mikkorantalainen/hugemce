import { GeneralSteps } from '@ephox/agar';
import { Logger } from '@ephox/agar';
import { Pipeline } from '@ephox/agar';
import { Step } from '@ephox/agar';
import { TinyApis } from '@ephox/mcagar';
import { TinyLoader } from '@ephox/mcagar';
import TextpatternPlugin from 'tinymce/plugins/textpattern/Plugin';
import Utils from '../module/test/Utils';
import ModernTheme from 'tinymce/themes/modern/Theme';
import { UnitTest } from '@ephox/refute';

UnitTest.asynctest(
  'browser.tinymce.plugins.textpattern.TriggerInlinePatternBeginningTest',
  function() {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TextpatternPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      // var tinyActions = TinyActions(editor);

      var steps = Utils.withTeardown([
        Logger.t('enter after first * in *a*', GeneralSteps.sequence([
          tinyApis.sSetContent('<p>*a*</p>'),
          tinyApis.sFocus,
          tinyApis.sSetCursor([0, 0], 1),
          Step.sync(function () {
            editor.fire('keydown', { keyCode: 13 });
          }),
          tinyApis.sAssertContent('<p>*</p><p>a*</p>')
        ])),
        Logger.t('enter after first * in *a*', GeneralSteps.sequence([
          tinyApis.sSetContent('<p><strong>a</strong>*b*</p>'),
          tinyApis.sFocus,
          tinyApis.sSetCursor([0, 1], 1),
          Step.sync(function () {
            editor.fire('keydown', { keyCode: 13 });
          })
        ]))
      ], tinyApis.sSetContent(''));

      Pipeline.async({}, steps, onSuccess, onFailure);
    }, {
      plugins: 'textpattern',
      toolbar: 'textpattern',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);


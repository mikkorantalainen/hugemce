import { Assertions, GeneralSteps, Logger, Pipeline, Step } from '@hugemce/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Fun } from '@hugemce/katamari';

import { Editor } from 'hugemce/mcagar/alien/EditorTypes';
import { TinyApis } from 'hugemce/mcagar/api/pipeline/TinyApis';
import * as TinyLoader from 'hugemce/mcagar/api/pipeline/TinyLoader';

UnitTest.asynctest('TinySetAndDeleteSettingTest', (success, failure) => {

  const sAssertSetting = (editor: Editor, key: string, expected: any) => {
    return Step.sync(() => {
      const actual = editor.options ? editor.options.get(key) : editor.settings?.[key];

      return Assertions.assertEq('should have expected val at key', expected, actual);
    });
  };

  const sAssertSettingType = (editor: Editor, key: string, expected: any) => {
    return Step.sync(() => {
      const actual = editor.options ? editor.options.get(key) : editor.settings?.[key];

      return Assertions.assertEq('should have expected type', expected, typeof actual);
    });
  };

  TinyLoader.setupLight((editor, loadSuccess, loadFailure) => {
    if (editor.options) {
      editor.options.register('a', { processor: Fun.always });
    }
    const apis = TinyApis(editor);

    Pipeline.async({}, [
      Logger.t('set and change setting', GeneralSteps.sequence([
        apis.sSetSetting('a', 'b'),
        sAssertSetting(editor, 'a', 'b'),
        apis.sSetSetting('a', 'c'),
        sAssertSetting(editor, 'a', 'c')
      ])),

      Logger.t('set setting to function', GeneralSteps.sequence([
        apis.sSetSetting('a', Fun.identity),
        sAssertSettingType(editor, 'a', 'function')
      ])),

      Logger.t('delete setting', GeneralSteps.sequence([
        apis.sDeleteSetting('a'),
        sAssertSetting(editor, 'a', undefined)
      ]))
    ], loadSuccess, loadFailure);

  }, {
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});

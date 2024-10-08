import { Assert, UnitTest } from '@ephox/bedrock-client';
import { Singleton } from '@hugemce/katamari';
import { Insert, Remove, SugarBody, SugarElement } from '@hugemce/sugar';

import { Chain } from 'hugemce/agar/api/Chain';
import { cRunOnPatchedFileInput, sRunOnPatchedFileInput } from 'hugemce/agar/api/FileInput';
import { createFile } from 'hugemce/agar/api/Files';
import * as GeneralSteps from 'hugemce/agar/api/GeneralSteps';
import * as Logger from 'hugemce/agar/api/Logger';
import { Pipeline } from 'hugemce/agar/api/Pipeline';
import { Step } from 'hugemce/agar/api/Step';

UnitTest.asynctest('PatchFileInputTest', (success, failure) => {
  const files = [ createFile('a.txt', 0, new Blob([ 'x' ])) ];
  const filesState = Singleton.value<FileList>();

  const pickFiles = (body: SugarElement<Node>, next: (files: FileList) => void) => {
    const elm = SugarElement.fromHtml<HTMLInputElement>('<input type="file">');
    elm.dom.onchange = () => {
      Remove.remove(elm);
      next(elm.dom.files);
    };
    Insert.append(body, elm);
    elm.dom.click();
  };

  const cPickFiles = Chain.async<SugarElement<Node>, FileList>((input, next, _die) => pickFiles(input, next));
  const sPickFiles = Step.async((next, _die) => pickFiles(SugarBody.body(), (files) => {
    filesState.set(files);
    next();
  }));

  const assetFiles = (files: FileList) => {
    Assert.eq('Should be expected number of files', 1, files.length);
    Assert.eq('Should be expected file name', 'a.txt', files[0].name);
    Assert.eq('Should be expected file size', 1, files[0].size);
  };

  Pipeline.async({}, [
    Logger.t('Patch file input step', GeneralSteps.sequence([
      sRunOnPatchedFileInput(files, sPickFiles),
      Step.sync(() => {
        const files = filesState.get().getOrDie('Failed to get files state');
        assetFiles(files);
        filesState.clear();
      })
    ])),

    Logger.t('Patch file input chain', Chain.asStep(SugarBody.body(), [
      cRunOnPatchedFileInput(files, cPickFiles),
      Chain.op(assetFiles)
    ]))
  ], success, failure);
});

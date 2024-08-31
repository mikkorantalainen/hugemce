import { context, describe, it } from '@hugemce/bedrock-client';
import { Unicode } from '@hugemce/katamari';
import { assert } from 'chai';

import * as Html from 'tinymce/plugins/visualchars/core/Html';

describe('atomic.tinymce.plugins.visualchars.HtmlTest', () => {
  context('wrapCharWithSpan', () => {
    it('should return correct span with nbsp', () => {
      assert.equal(
        '<span data-mce-bogus="1" class="mce-nbsp">' + Unicode.nbsp + '</span>',
        Html.wrapCharWithSpan(Unicode.nbsp)
      );
    });

    it('should return correct span with soft hyphen', () => {
      assert.equal(
        '<span data-mce-bogus="1" class="mce-shy">' + Unicode.softHyphen + '</span>',
        Html.wrapCharWithSpan(Unicode.softHyphen)
      );
    });
  });
});

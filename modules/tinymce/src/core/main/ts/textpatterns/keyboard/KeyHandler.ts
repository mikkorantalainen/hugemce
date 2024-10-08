import { Fun, Unicode } from '@hugemce/katamari';

import * as TextSearch from '../../alien/TextSearch';
import Editor from '../../api/Editor';
import VK from '../../api/util/VK';
import * as Zwsp from '../../text/Zwsp';
import * as BlockPattern from '../core/BlockPattern';
import * as BlockPatternOnSpace from '../core/BlockPatternOnSpace';
import * as InlinePattern from '../core/InlinePattern';
import { PatternSet } from '../core/PatternTypes';
import * as Utils from '../utils/Utils';

const handleEnter = (editor: Editor, patternSet: PatternSet): boolean =>
  BlockPattern.getMatches(editor, patternSet).fold(
    Fun.never,
    ({ inlineMatches, blockMatches }) => {
      editor.undoManager.add();
      editor.undoManager.extra(
        () => {
          editor.execCommand('mceInsertNewLine');
        },
        () => {
          // create a cursor position that we can move to avoid the inline formats
          Zwsp.insert(editor);
          InlinePattern.applyMatches(editor, inlineMatches);
          BlockPattern.applyMatches(editor, blockMatches);
          // find the spot before the cursor position
          const range = editor.selection.getRng();
          const spot = TextSearch.textBefore(range.startContainer, range.startOffset, editor.dom.getRoot());
          editor.execCommand('mceInsertNewLine');
          // clean up the cursor position we used to preserve the format
          spot.each((s) => {
            const node = s.container;
            if (node.data.charAt(s.offset - 1) === Unicode.zeroWidth) {
              node.deleteData(s.offset - 1, 1);
              Utils.cleanEmptyNodes(editor.dom, node.parentNode, (e: Node) => e === editor.dom.getRoot());
            }
          });
        }
      );
      return true;
    });

const handleInlineKey = (
  editor: Editor,
  patternSet: PatternSet
): void => {
  const rng = editor.selection.getRng();
  Utils.getParentBlock(editor, rng).map((block) => {
    const offset = Math.max(0, rng.startOffset - 1);
    const beforeText = Utils.getBeforeText(editor.dom, block, rng.startContainer, offset);
    const dynamicPatternSet = Utils.resolveFromDynamicPatterns(patternSet, block, beforeText);
    const inlineMatches = InlinePattern.findPatterns(editor, block, rng.startContainer, offset, dynamicPatternSet, false);
    if (inlineMatches.length > 0) {
      editor.undoManager.transact(() => {
        InlinePattern.applyMatches(editor, inlineMatches);
      });
    }
  });
};

const handleBlockPatternOnSpace = (editor: Editor, patternSet: PatternSet): boolean =>
  BlockPatternOnSpace.getMatches(editor, patternSet).fold(
    Fun.never,
    (matches) => {
      editor.undoManager.transact(() => {
        BlockPatternOnSpace.applyMatches(editor, matches);
      });
      return true;
    });

const checkKeyEvent = <T>(codes: T[], event: KeyboardEvent, predicate: (code: T, event: KeyboardEvent) => boolean): boolean => {
  for (let i = 0; i < codes.length; i++) {
    if (predicate(codes[i], event)) {
      return true;
    }
  }
  return false;
};

const checkKeyCode = (codes: number[], event: KeyboardEvent): boolean =>
  checkKeyEvent(codes, event, (code, event) => {
    return code === event.keyCode && !VK.modifierPressed(event);
  });

const checkCharCode = (chars: string[], event: KeyboardEvent): boolean =>
  checkKeyEvent(chars, event, (chr, event) => {
    return chr.charCodeAt(0) === event.charCode;
  });

export {
  handleEnter,
  handleInlineKey,
  handleBlockPatternOnSpace,
  checkCharCode,
  checkKeyCode
};

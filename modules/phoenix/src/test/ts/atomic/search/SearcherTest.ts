import { Assert, describe, it } from '@ephox/bedrock-client';
import { Gene, TestUniverse, TextGene } from '@hugemce/boss';
import { Arr, Fun } from '@hugemce/katamari';

import * as Searcher from 'hugemce/phoenix/search/Searcher';
import * as Finder from 'hugemce/phoenix/test/Finder';
import * as TestRenders from 'hugemce/phoenix/test/TestRenders';

interface CheckItem {
  readonly items: string[];
  readonly word: string;
  readonly exact: string;
}

describe('atomic.polaris.search.SearcherTest', () => {
  const checkWords = (expected: CheckItem[], itemIds: string[], words: string[], input: Gene) => {
    const universe = TestUniverse(input);
    const items = Finder.getAll(universe, itemIds);
    const actual = Searcher.safeWords(universe, items, words, Fun.never);

    const processed = Arr.map(actual, (match): CheckItem => {
      return {
        items: TestRenders.texts(match.elements),
        word: match.word,
        exact: match.exact
      };
    });
    Assert.eq(`Asserting result for word "${items.flatMap(({ children }) => children.map((x) => x.text)).join('')}"`, expected, processed);
  };

  it('TINY-10062: Search for words in multiply text elements', () => {
    /*
      An example of some <b>test</b> data. The word being looked for will be word and for.

      There will be a couple of paragraphs. Some ending with fo

      r and more.

      <p>An example of some <span>test</span>data. The words being looked for will be word and for and test.</p>
      <p>There will be three paragraphs. This one ends with partial fo</p>
      <p>r and more.</p>
    */
    const data = () => {
      return Gene('root', 'root', [
        Gene('p1', 'p', [
          TextGene('p1-a', 'An example of some '),
          Gene('span1', 'span', [
            TextGene('span1-a', 'test')
          ]),
          TextGene('p1-b', ' data. The word being looked for will be w'),
          Gene('span1b', 'span', [
            Gene('span1ba', 'span', [
              TextGene('p1-c', 'or')
            ])
          ]),
          TextGene('p1-d', 'd and for.')
        ]),
        Gene('p2', 'p', [
          TextGene('p2-a', 'There will be some tes'),
          Gene('span2', 'span', [
            TextGene('span2-a', 't')
          ]),
          TextGene('p2-b', ' paragraphs. This one ends with a partial fo')
        ]),
        Gene('p3', 'p', [
          TextGene('p3-a', 'r and more.')
        ])
      ]);
    };

    // An example of some <test> data. The <word> being looked <for> will be <w_or_d> and <for>.|There will be some <tes_t>
    // paragraphs. This one ends with a partial fo|r and more.
    checkWords([
      { items: [ 'test' ], word: 'test', exact: 'test' },
      { items: [ 'word' ], word: 'word', exact: 'word' },
      { items: [ 'for' ], word: 'for', exact: 'for' },
      { items: [ 'w', 'or', 'd' ], word: 'word', exact: 'word' },
      { items: [ 'for' ], word: 'for', exact: 'for' },
      { items: [ 'tes', 't' ], word: 'test', exact: 'test' }
    ], [ 'p1', 'p2', 'p3' ], [ 'for', 'test', 'word' ], data());
  });

  it('TINY-10062: Search for words in single text element', () => {
    checkWords([
      { items: [ '<p>' ], word: '<p>', exact: '<p>' },
      { items: [ ' Hello' ], word: ' Hello', exact: ' Hello' },
      { items: [ 'World<' ], word: 'World<', exact: 'World<' },
      { items: [ 'p>' ], word: 'p>', exact: 'p>' },
    ],
    [ 'p1' ],
    [ '<p>', ' Hello', 'World<', 'p>' ],
    Gene('root', 'root', [
      Gene('p1', 'p', [
        TextGene('p1-a', '<p> Hello World</p>'),
      ]),
    ]));

    checkWords([
      { items: [ '<p>Hello' ], word: '<p>Hello', exact: '<p>Hello' },
      { items: [ 'World<' ], word: 'World<', exact: 'World<' },
      { items: [ 'p>' ], word: 'p>', exact: 'p>' },
    ],
    [ 'p1' ],
    [ '<p>Hello', 'World<', 'p>' ],
    Gene('root', 'root', [
      Gene('p1', 'p', [
        TextGene('p1-a', '<p>Hello World</p>'),
      ]),
    ]));

    checkWords([
      { items: [ '<p>Hello' ], word: '<p>Hello', exact: '<p>Hello' },
      { items: [ 'World' ], word: 'World', exact: 'World' },
      { items: [ '<' ], word: '<', exact: '<' },
      { items: [ 'p>' ], word: 'p>', exact: 'p>' },
    ],
    [ 'p1' ],
    [ '<p>Hello', 'World', '<', 'p>' ],
    Gene('root', 'root', [
      Gene('p1', 'p', [
        TextGene('p1-a', '<p>Hello World </p>'),
      ]),
    ]));

    checkWords([
      { items: [ '<p>' ], word: '<p>', exact: '<p>' },
      { items: [ 'Hello' ], word: 'Hello', exact: 'Hello' },
      { items: [ 'World' ], word: 'World', exact: 'World' },
      { items: [ '<' ], word: '<', exact: '<' },
      { items: [ 'p>' ], word: 'p>', exact: 'p>' },
    ],
    [ 'p1' ],
    [ '<p>', 'Hello', 'World', '<', 'p>' ],
    Gene('root', 'root', [
      Gene('p1', 'p', [
        TextGene('p1-a', '<p> Hello World </p>'),
      ]),
    ]));

    checkWords([
      { items: [ 'IF:INTEXT' ], word: 'IF:INTEXT', exact: 'IF:INTEXT' },
      { items: [ 'IF' ], word: 'IF', exact: 'IF' },
    ],
    [ 'p1' ],
    [ 'IF:INTEXT', 'IF' ],
    Gene('root', 'root', [
      Gene('p1', 'p', [
        TextGene('p1-a', 'Test. [IF:INTEXT]Test2 [/IF]'),
      ]),
    ]));

    checkWords([
      { items: [ 'IF' ], word: 'IF', exact: 'IF' },
      { items: [ 'IF:INTEXT' ], word: 'IF:INTEXT', exact: 'IF:INTEXT' },
    ],
    [ 'p1' ],
    [ 'IF', 'IF:INTEXT' ],
    Gene('root', 'root', [
      Gene('p1', 'p', [
        TextGene('p1-a', 'Test. [/IF]Test2 [IF:INTEXT]'),
      ]),
    ]));
  });
});

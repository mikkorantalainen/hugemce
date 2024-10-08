import { PRegExp } from '@hugemce/polaris';

export interface NamedPattern {
  word: string;
  pattern: PRegExp;
}

export const NamedPattern = (word: string, pattern: PRegExp): NamedPattern => ({
  word,
  pattern
});

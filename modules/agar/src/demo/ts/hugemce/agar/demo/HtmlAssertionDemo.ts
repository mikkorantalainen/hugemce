import * as Assertions from 'hugemce/agar/api/Assertions';
import { Pipeline } from 'hugemce/agar/api/Pipeline';
import * as DemoContainer from 'hugemce/agar/demo/DemoContainer';

export const demo = (): void => {
  DemoContainer.init(
    'HTML Assertions',
    (success, failure) => {

      Pipeline.async({}, [
        Assertions.sAssertHtml('Testing HTML', '<p>This sentence is slightly wrong</p>', '<p>This sentence is sightly wrng</p>')

      ], success, (err) => {
        failure(err);
      });

      return [ ];
    }
  );
};

import { Cell } from '@hugemce/katamari';

import { FullScreenInfo } from '../core/Actions';

export interface Api {
  readonly isFullscreen: () => boolean;
}

const get = (fullscreenState: Cell<FullScreenInfo | null>): Api => ({
  isFullscreen: () => fullscreenState.get() !== null
});

export {
  get
};

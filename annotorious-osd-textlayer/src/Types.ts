import type { ImageAnnotation } from '@annotorious/annotorious';

export interface TextLayerOpts {

  defaultVisible?: boolean;

  label(annotation: ImageAnnotation): string | undefined;

  mode?: 'fillBounds' | 'fixedPageSize' | 'fixedScreenSize';

  offsetX?: number;

  offsetY?: number;

  position?: 'topleft' | 'bottomleft' | 'center';

}

export type OCRFormat = 'ALTO';
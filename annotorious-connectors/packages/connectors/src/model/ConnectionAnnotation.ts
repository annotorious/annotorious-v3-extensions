import type { Annotation, AnnotationTarget, ImageAnnotation } from '@annotorious/annotorious';

export const isConnectionAnnotation = (annotation: ImageAnnotation | ConnectionAnnotation): annotation is ConnectionAnnotation =>
  (annotation as ConnectionAnnotation).motivation !== undefined &&
  (annotation as ConnectionAnnotation).motivation === 'linking';

export interface ConnectionAnnotation extends Annotation {

  motivation: 'linking';

  target: ConnectionAnnotationTarget;

}

export interface ConnectionAnnotationTarget extends AnnotationTarget {

  selector: {

    from: string;

    to: string;  
  }

}

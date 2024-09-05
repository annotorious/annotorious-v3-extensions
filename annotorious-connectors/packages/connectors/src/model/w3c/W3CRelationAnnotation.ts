import type { W3CAnnotation } from '@annotorious/annotorious';

export interface W3CRelationLinkAnnotation extends Omit<W3CAnnotation, 'body'> {

  motivation: 'linking';

  body: string;

  target: string;

}

export interface W3CRelationMetaAnnotation extends Omit<W3CAnnotation, 'target'> {

  motivation?: 'tagging',

  target: string;

}



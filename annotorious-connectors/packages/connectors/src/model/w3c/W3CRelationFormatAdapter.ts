import { W3CImageFormat } from '@annotorious/annotorious';
import type { ConnectionAnnotation } from '../ConnectionAnnotation';
import type { W3CRelationLinkAnnotation, W3CRelationMetaAnnotation } from './W3CRelationAnnotation';
import type { 
  FormatAdapter, 
  ImageAnnotation, 
  ParseResult, 
  W3CAnnotationBody, 
  W3CImageAnnotation, 
  W3CImageFormatAdapter, 
  W3CImageFormatAdapterOpts
} from '@annotorious/annotorious';

const isConnectionAnnotation = (arg: any): arg is ConnectionAnnotation => 
  arg.motivation !== undefined && arg.motivation === 'linking';

const isW3CRelationLinkAnnotation = (arg: any): arg is W3CRelationLinkAnnotation =>
  arg.motivation !== undefined && 
  arg.motivation === 'linking' &&
  arg.body !== undefined && 
  arg.target !== undefined &&
  typeof arg.body === 'string' && 
  typeof arg.target === 'string';

export type W3CRelationFormatAdapter = FormatAdapter<
  // Internal model
  ImageAnnotation | ConnectionAnnotation, 
  // Serialized to W3C - hellishly complicated but standards-compliant...
  W3CImageAnnotation | W3CRelationLinkAnnotation | [W3CRelationLinkAnnotation, W3CRelationMetaAnnotation]>;

export const W3CImageRelationFormat = (
  source: string,
  opts: W3CImageFormatAdapterOpts = { strict: true, invertY: false }
): W3CRelationFormatAdapter => {
  const imageAdapter = W3CImageFormat(source, {...opts, strict: false });

  const parse = (serialized: W3CImageAnnotation | W3CRelationLinkAnnotation | [W3CRelationLinkAnnotation, W3CRelationMetaAnnotation]) =>
    parseW3C(serialized, imageAdapter);

  const serialize = (annotation: ImageAnnotation | ConnectionAnnotation) =>
    serializeW3C(annotation, imageAdapter);

  return { parse, serialize }
}

export const parseW3C = (
  arg: W3CImageAnnotation | W3CRelationLinkAnnotation | [W3CRelationLinkAnnotation, W3CRelationMetaAnnotation],
  imageAdapter: W3CImageFormatAdapter 
): ParseResult<ImageAnnotation | ConnectionAnnotation> => {
  if (Array.isArray(arg)) {
    // TODO
    const parsed = 'foo' as unknown as ConnectionAnnotation;

    return { parsed };
  } else if (isW3CRelationLinkAnnotation(arg)) {
    const { id, body, target } = arg;

    const parsed: ConnectionAnnotation = {
      id,
      motivation: 'linking',
      bodies: [],
      target: {
        annotation: id,
        selector: {
          from: target,
          to: body
        }
      }
    };

    return { parsed };
  } else {
    return imageAdapter.parse(arg)
  }
}

export const serializeW3C = (
  annotation: ImageAnnotation | ConnectionAnnotation, 
  imageAdapter: W3CImageFormatAdapter
): W3CImageAnnotation | W3CRelationLinkAnnotation | [W3CRelationLinkAnnotation, W3CRelationMetaAnnotation] => {
  if (isConnectionAnnotation(annotation)) {
    const { id, bodies, target: { selector: { from, to }} } = annotation;

    const link = { 
      id,
      motivation: 'linking',
      body: to,
      target: from
    } as W3CRelationLinkAnnotation;

    if (bodies.length > 0) {
      const meta = {
        motivation: 'tagging',
        body: bodies.map(b => ({
          value: b.value
        } as W3CAnnotationBody)),
        target: id
      } as W3CRelationMetaAnnotation;

      return [link, meta];
    } else {
      return link;
    }
  } else {
    return imageAdapter.serialize(annotation)
  }
}
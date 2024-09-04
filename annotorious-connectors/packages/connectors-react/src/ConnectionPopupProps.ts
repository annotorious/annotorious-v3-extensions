import { AnnotationBody } from '@annotorious/react';
import { ConnectionAnnotation } from '@annotorious/plugin-connectors';

export interface ConnectionPopupProps {

  annotation: ConnectionAnnotation;

  onCreateBody(body: AnnotationBody): void;

  onDeleteBody(id: string): void;

  onUpdateBody(current: AnnotationBody, next: AnnotationBody): void;
}
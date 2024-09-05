export * from './components';
export * from './hooks';
export * from './openseadragon';
export * from './ConnectionPopupProps';
export * from './ConnectorPlugin';
export * from './ConnectorPluginProvider';

// Re-publish the stylesheet
import '@annotorious/plugin-connectors/annotorious-connectors.css';

// Essential re-rexports from base package
export type {
  Connection,
  ConnectionAnnotation,
  ConnectionAnnotationTarget,
  Point,
  W3CRelationLinkAnnotation,
  W3CRelationMetaAnnotation
} from '@annotorious/plugin-connectors';

export {
  W3CImageRelationFormat
} from '@annotorious/plugin-connectors';
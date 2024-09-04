import { ConnectionAnnotation, isConnectionAnnotation } from '@annotorious/plugin-connectors';
import { ImageAnnotation, useAnnotations } from '@annotorious/react';
import { useMemo } from 'react';

/**
 * A utility hook similar to useAnnotations, but filtering 
 * connection annotations.
 */
export const useConnections = () => {

  const annotations = useAnnotations<ImageAnnotation | ConnectionAnnotation>();

  const connections = useMemo(() => (
    annotations.filter(isConnectionAnnotation)
  ), [annotations]);

  return connections;
  
}
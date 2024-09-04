import { useAnnotations } from '@annotorious/react';
import { useMemo } from 'react';

/**
 * A utility hook similar to useAnnotations, but filtering 
 * connection annotations.
 */
export const useConnections = () => {

  const annotations = useAnnotations();

  const connections = useMemo(() => {
    // TODO
    return annotations;
  }, [annotations]);

  return connections;
  
}
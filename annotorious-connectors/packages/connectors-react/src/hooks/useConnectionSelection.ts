import { useMemo } from 'react';
import { ImageAnnotation, useSelection } from '@annotorious/react';
import { ConnectionAnnotation, isConnectionAnnotation, Point } from '@annotorious/plugin-connectors';
import { useConnectorPlugin } from './useConnectorPlugin';

export interface ConnectionSelection {

  annotation?: ConnectionAnnotation;

  editable?: boolean;

  midpoint?: Point;

  event?: Event;

}

export const useConnectionSelection = () => {

  const plugin = useConnectorPlugin();

  const selection = useSelection<ImageAnnotation | ConnectionAnnotation>();

  const connectionSelection: ConnectionSelection = useMemo(() => {
    if (!plugin) return {};

    const { selected, event } = selection;
    
    const selectedConnections = selected.filter(({ annotation }) => isConnectionAnnotation(annotation));
    if (selectedConnections.length > 0) {
      const { annotation, editable } = selectedConnections[0];
      
      const midpoint = plugin.getMidpoint(annotation.id);

      return { annotation: annotation as ConnectionAnnotation, midpoint, editable, event };
    } else {
      return {};
    }
  }, [selection, plugin]);

  return connectionSelection;

}
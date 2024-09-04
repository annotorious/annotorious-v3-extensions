import { useMemo } from 'react';
import { ImageAnnotation, useSelection } from '@annotorious/react';
import { ConnectionAnnotation, isConnectionAnnotation } from '@annotorious/plugin-connectors';

export const useConnectionSelection = () => {

  const selection = useSelection<ImageAnnotation | ConnectionAnnotation>();

  const [annotation, editable, event]: [ConnectionAnnotation, boolean, Event] = useMemo(() => {
    const { selected, event } = selection;
    
    const selectedConnections = selected.filter(({ annotation }) => isConnectionAnnotation(annotation));
    if (selectedConnections.length > 0) {
      const { annotation, editable } = selectedConnections[0]
      return [annotation as ConnectionAnnotation, editable, event];
    } else {
      return [undefined, undefined, undefined];
    }
  }, [selection]);

  return { annotation, editable, event };

}
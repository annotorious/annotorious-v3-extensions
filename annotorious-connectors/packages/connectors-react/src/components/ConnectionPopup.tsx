import { useEffect } from 'react';
import { useConnectionSelection } from '../hooks/useConnectionSelection';

export const ConnectionPopup = () => {

  const { annotation, midpoint } = useConnectionSelection();

  useEffect(() => {
    console.log('selected:', annotation, midpoint);
  }, [annotation, midpoint]);

  return null;

}
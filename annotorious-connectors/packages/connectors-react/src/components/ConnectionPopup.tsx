import { useEffect } from 'react';
import { useConnectionSelection } from 'src/hooks/useConnectionSelection';

export const ConnectionPopup = () => {

  const { annotation } = useConnectionSelection();

  useEffect(() => {
    console.log('selected:', annotation);
  }, [annotation]);

  return null;

}
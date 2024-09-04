import { useConnections } from '../hooks/useConnections';

export const ConnectionPopup = () => {

  const connections = useConnections();

  console.log('connections:', connections);

  return null;

}
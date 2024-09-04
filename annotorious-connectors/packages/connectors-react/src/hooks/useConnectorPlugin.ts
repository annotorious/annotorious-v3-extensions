import { useContext } from 'react';
import { ConnectorPluginInstance } from '@annotorious/plugin-connectors';
import { ConnectorPluginContext } from '../ConnectorPluginProvider';

export const useConnectorPlugin = () => {
  const { instance } = useContext(ConnectorPluginContext);
  return instance as ConnectorPluginInstance;
}

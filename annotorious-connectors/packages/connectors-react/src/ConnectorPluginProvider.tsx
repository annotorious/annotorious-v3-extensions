import { ReactNode, createContext } from 'react';
import { ConnectorPluginInstance } from '@annotorious/plugin-connectors';

interface ConnectorPluginProviderProps {

  children: ReactNode;

  instance?: ConnectorPluginInstance;

}

export const ConnectorPluginContext = createContext({

  instance: undefined,

});

export const ConnectorPluginProvider = (props: ConnectorPluginProviderProps) => {

  return (
    <ConnectorPluginContext.Provider value={{ instance: props.instance }}>
      {props.children}
    </ConnectorPluginContext.Provider>
  )

}
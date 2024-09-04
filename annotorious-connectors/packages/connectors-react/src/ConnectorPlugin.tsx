import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { ConnectorPluginInstance, mountPlugin as _mountPlugin } from '@annotorious/plugin-connectors';
import { ConnectorPluginProvider } from './ConnectorPluginProvider';

interface ConnectorPluginProps {

  children?: ReactNode;

  enabled?: boolean;

}

export const ConnectorPlugin = (props: ConnectorPluginProps) => {

  const ref = useRef<ConnectorPluginInstance>();

  const [instance, setInstance] = useState<ConnectorPluginInstance>();

  const mountPlugin = useCallback((anno: AnnotoriousImageAnnotator) => _mountPlugin(anno), []);

  useEffect(() => {
    ref.current?.setEnabled(props.enabled);
  }, [props.enabled]);

  return (
    <ConnectorPluginProvider instance={instance}>
      <AnnotoriousPlugin 
        pluginRef={ref}
        plugin={mountPlugin} 
        onLoad={instance => setInstance(instance as ConnectorPluginInstance)} />

      {props.children}
    </ConnectorPluginProvider>
  )

}
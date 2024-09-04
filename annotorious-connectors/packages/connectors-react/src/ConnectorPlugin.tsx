import { useEffect, useRef } from 'react';
import { AnnotoriousPlugin } from '@annotorious/react';
import { ConnectorPluginInstance, mountPlugin } from '@annotorious/plugin-connectors';

interface ConnectorPluginProps {

  enabled?: boolean;

}

export const ConnectorPlugin = (props: ConnectorPluginProps) => {

  const ref = useRef<ConnectorPluginInstance>();

  useEffect(() => {
    ref.current?.setEnabled(props.enabled);
  }, [props.enabled]);

  return (
    <AnnotoriousPlugin 
      pluginRef={ref}
      plugin={mountPlugin} />
  )

}
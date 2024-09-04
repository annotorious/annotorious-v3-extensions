import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { AnnotoriousPlugin, useViewer } from '@annotorious/react';
import { mountOSDPlugin } from '@annotorious/plugin-connectors';
import { ImageAnnotator } from '@annotorious/annotorious';
import { ConnectorPluginProvider } from 'src/ConnectorPluginProvider';

type ConnectorPluginInstance = ReturnType<typeof mountOSDPlugin>;

interface OSDConnectorPluginProps {

  children?: ReactNode;

  enabled?: boolean;

}

export const OSDConnectorPlugin = (props: OSDConnectorPluginProps) => {

  const viewer = useViewer();

  const ref = useRef<ConnectorPluginInstance>();

  const [instance, setInstance] = useState<ConnectorPluginInstance>();

  const mountPlugin = useCallback((anno: ImageAnnotator) => mountOSDPlugin(anno, viewer), [viewer]);

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
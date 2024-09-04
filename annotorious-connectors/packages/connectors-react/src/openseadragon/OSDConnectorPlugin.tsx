import { AnnotoriousPlugin, useViewer } from '@annotorious/react';
import { mountOSDPlugin } from '@annotorious/plugin-connectors';
import { useCallback, useEffect, useRef } from 'react';
import { ImageAnnotator } from '@annotorious/annotorious';

type ConnectorPluginInstance = ReturnType<typeof mountOSDPlugin>;

interface OSDConnectorPluginProps {

  enabled?: boolean;

}

export const OSDConnectorPlugin = (props: OSDConnectorPluginProps) => {

  const viewer = useViewer();

  const mountPlugin = useCallback((anno: ImageAnnotator) => mountOSDPlugin(anno, viewer), [viewer]);

  const pluginInstance = useRef<ConnectorPluginInstance>(undefined);

  useEffect(() => {
    if (pluginInstance.current)
      pluginInstance.current.setEnabled(props.enabled);
  }, [props.enabled]);

  return (
    <AnnotoriousPlugin 
      pluginRef={pluginInstance}
      plugin={mountPlugin} />
  )

}
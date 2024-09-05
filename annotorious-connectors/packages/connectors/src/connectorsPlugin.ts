import type { ImageAnnotation, ImageAnnotator, ImageAnnotatorState } from '@annotorious/annotorious';
import type { Point } from './model';
import { ConnectorLayer } from './ConnectorLayer';

export interface ConnectorPluginInstance {

  getMidpoint(id: string): Point | undefined;

  setEnabled(enabled: boolean): void;

  unmount(): void;

}

export const mountPlugin = (anno: ImageAnnotator<ImageAnnotation>): ConnectorPluginInstance => {

  let isEnabled = false;

  const connectorLayer = new ConnectorLayer({
    target: anno.element,
    props: {
      enabled: isEnabled,
      state: anno.state as ImageAnnotatorState<ImageAnnotation>
    }
  });

  /** API **/

  const getMidpoint = (id: string) =>
    connectorLayer.getMidpoint(id);

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    connectorLayer.$set({ enabled: isEnabled });
  }

  const unmount = () => {
    // Nothing to do
  }

  return { 
    getMidpoint,
    setEnabled,
    unmount
  }

}
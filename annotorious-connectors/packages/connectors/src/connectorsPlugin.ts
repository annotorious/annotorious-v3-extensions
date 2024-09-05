import type { ImageAnnotation, ImageAnnotator, ImageAnnotatorState } from '@annotorious/annotorious';
import type { Point } from './model';
import { ConnectorLayer } from './ConnectorLayer';

export interface ConnectorPluginInstance {

  getMidpoint(id: string): Point | undefined;

  setEnabled(enabled: boolean): void;

  unmount(): void;

}

export const mountPlugin = (anno: ImageAnnotator<ImageAnnotation>): ConnectorPluginInstance => {

  const { selection, store } = anno.state;

  let isEnabled = false;

  const connectorLayer = new ConnectorLayer({
    target: anno.element,
    props: {
      enabled: isEnabled,
      source: undefined as ImageAnnotation | undefined,
      state: anno.state as ImageAnnotatorState<ImageAnnotation>
    }
  });

  const unsubscribeSelection = selection.subscribe(({ selected }) => {
    if (isEnabled && selected.length > 0) {
      const source = store.getAnnotation(selected[0].id);
      connectorLayer.$set(({ source }));
    }
  });

  /** API **/

  const getMidpoint = (id: string) =>
    connectorLayer.getMidpoint(id);

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    connectorLayer.$set({ source: undefined });
    connectorLayer.$set({ enabled: isEnabled });
  }

  const unmount = () => {
    unsubscribeSelection();
  }

  return { 
    getMidpoint,
    setEnabled,
    unmount
  }

}
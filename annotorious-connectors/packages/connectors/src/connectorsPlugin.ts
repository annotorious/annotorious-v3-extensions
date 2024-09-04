import { ConnectorLayer } from './ConnectorLayer';
import type { 
  ImageAnnotation,
  ImageAnnotator,
  ImageAnnotatorState,
} from '@annotorious/annotorious';

export interface ConnectorPluginInstance {

  setEnabled(enabled: boolean): void;

  unmount(): void;

}

export const mountPlugin = (anno: ImageAnnotator<ImageAnnotation>): ConnectorPluginInstance => {

  const { store, selection } = anno.state;

  let isEnabled = false;

  const connectorLayer = new ConnectorLayer({
    target: anno.element,
    props: {
      source: undefined as ImageAnnotation | undefined,
      state: anno.state as ImageAnnotatorState<ImageAnnotation>
    }
  });

  const unsubscribe = selection.subscribe(({ selected }) => {
    if (isEnabled && selected.length > 0) {
      const source = store.getAnnotation(selected[0].id);
      connectorLayer.$set(({ source }));
    }
  });

  /** API **/

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    connectorLayer.$set({ source: undefined });
  }

  const unmount = () => {
    unsubscribe();
  }

  return { 
    setEnabled,
    unmount
  }

}
import type OpenSeadragon from 'openseadragon';
import { UserSelectAction } from '@annotorious/openseadragon';
import OSDConnectorLayer from './OSDConnectorLayer.svelte';
import type { 
  ImageAnnotation,
  ImageAnnotator,
  ImageAnnotatorState
} from '@annotorious/annotorious';

export const mountOSDPlugin = (anno: ImageAnnotator<ImageAnnotation>, viewer: OpenSeadragon.Viewer) => {

  const { store, selection } = anno.state;

  let isEnabled = false;

  const connectorLayer = new OSDConnectorLayer({
    target: viewer.element.querySelector('.openseadragon-canvas')!,
    props: {
      source: undefined as ImageAnnotation | undefined,
      state: anno.state as ImageAnnotatorState<ImageAnnotation>,
      viewer
    }
  });

  connectorLayer.$on('create', () => connectorLayer.$set(({ source: undefined })));

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

    // TODO this should actually revert to the last
    // action set by the host application. (But how?)
    if (enabled)
      anno.setUserSelectAction(UserSelectAction.SELECT);
    else 
      anno.setUserSelectAction(UserSelectAction.EDIT);
  }

  const unmount = () => unsubscribe();

  return { 
    setEnabled,
    unmount
  }

}
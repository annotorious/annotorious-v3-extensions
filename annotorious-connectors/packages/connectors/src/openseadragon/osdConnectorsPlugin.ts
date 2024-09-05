import type OpenSeadragon from 'openseadragon';
import { UserSelectAction } from '@annotorious/openseadragon';
import OSDConnectorLayer from './OSDConnectorLayer.svelte';
import type { ConnectorPluginInstance } from '../connectorsPlugin';
import type { 
  ImageAnnotation,
  ImageAnnotator,
  ImageAnnotatorState
} from '@annotorious/annotorious';

export const mountOSDPlugin = (
  anno: ImageAnnotator<ImageAnnotation>, 
  viewer: OpenSeadragon.Viewer
): ConnectorPluginInstance  => {

  const { store, selection } = anno.state;

  let isEnabled = false;

  const connectorLayer = new OSDConnectorLayer({
    target: viewer.element.querySelector('.openseadragon-canvas')!,
    props: {
      enabled: isEnabled,
      state: anno.state as ImageAnnotatorState<ImageAnnotation>,
      viewer
    }
  });

  /** API **/

  const getMidpoint = (id: string) =>
    connectorLayer.getMidpoint(id);

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;

    connectorLayer.$set({ enabled: isEnabled });

    // TODO this should actually revert to the last
    // action set by the host application. (But how?)
    if (enabled)
      anno.setUserSelectAction(UserSelectAction.SELECT);
    else 
      anno.setUserSelectAction(UserSelectAction.EDIT);
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
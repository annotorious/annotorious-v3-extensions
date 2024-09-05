<script lang="ts">
  import OpenSeadragon from 'openseadragon';
  import type { ImageAnnotatorState } from '@annotorious/annotorious';
  import type { ImageAnnotation } from '@annotorious/openseadragon';
  import ConnectorLayer from '../ConnectorLayer/ConnectorLayer.svelte';
  import OSDSVGLayer from './OSDSVGLayer.svelte';
  import type { Point } from '../model';

  /** Props **/
  export let enabled: boolean;
  export let state: ImageAnnotatorState<ImageAnnotation>;
  export let viewer: OpenSeadragon.Viewer;

  let connectorLayer: ConnectorLayer;

  export const getMidpoint = (id: string) => connectorLayer.getMidpoint(id);

  const pointerTransform = (point: Point): Point => {
    const {x, y} = viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(point.x, point.y));
    return { x, y };
  }
</script>

<OSDSVGLayer 
  viewer={viewer} 
  let:transform 
  let:scale>

  <ConnectorLayer 
    bind:this={connectorLayer}
    enabled={enabled}
    scale={scale}
    state={state} 
    layerTransform={transform} 
    pointerTransform={pointerTransform}
    on:create />
</OSDSVGLayer>
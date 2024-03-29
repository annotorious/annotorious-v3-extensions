<script lang="ts">
  import type { ImageAnnotation, ImageAnnotatorState, StoreChangeEvent } from '@annotorious/annotorious';
  import { onMount } from 'svelte';
  import { FillBoundsLabel, FixedPageSizeLabel, FixedScreenSizeLabel } from './Label';
  import type { TextLayerOpts } from './Types';
  import { getImageDimensions } from './ImageDimensions';
    
  /** props **/
  export let state: ImageAnnotatorState;
  export let viewer: OpenSeadragon.Viewer;
  export let opts: TextLayerOpts;
  export let visible: boolean = true;
  export let captureEvents: boolean = false;

  const { store } = state;

  let transform: string;

  let scale: number;

  let annotations: ImageAnnotation[] = [];

  let width: number;

  let height: number;

  $: fontSize = opts.fontSize || 16;

  const redraw = () => {
    const viewportBounds = viewer.viewport.viewportToImageRectangle(viewer.viewport.getBounds(true));

    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    scale = zoom * containerWidth / viewer.world.getContentFactor();

    // @ts-ignore note: getRotation(true <- realtime value) only since OSD 4!
    let rotation = Math.PI * viewer.viewport.getRotation(true) / 180;
    if (rotation < 0)
      rotation += 2 * Math.PI;
    
    if (rotation > 2 * Math.PI)
      rotation -= 2 * Math.PI;

    const flipped = viewer.viewport.getFlip();

    const dx = flipped ? 
      // @ts-ignore
      viewer.viewport._containerInnerSize.x + viewportBounds.x * scale :
      - viewportBounds.x * scale;

    const dy = - viewportBounds.y * scale;

    let offsetX: number, offsetY: number;

    if (rotation > 0 && rotation <= Math.PI / 2) {
      offsetX = viewportBounds.height * scale;
      offsetY = 0;
    } else if (rotation > Math.PI / 2 && rotation <= Math.PI) {
      offsetX = viewportBounds.width * scale;
      offsetY = viewportBounds.height * scale;
    } else if (rotation > Math.PI && rotation <= Math.PI * 1.5) {
      offsetX = 0;
      offsetY = viewportBounds.width * scale;
    } else {
      offsetX = 0;
      offsetY = 0;
    }

    const tx = Math.round(100 * (offsetX + dx * Math.cos(rotation) - dy * Math.sin(rotation))) / 100;
    const ty = Math.round(100 * (offsetY + dx * Math.sin(rotation) + dy * Math.cos(rotation))) / 100;
    
    transform = `translate(${tx}px, ${ty}px) rotate(${rotation}rad) scaleX(${flipped ? - scale : scale}) scaleY(${scale})`;
  }

  onMount(() => {
    getImageDimensions(viewer).then(dimensions => {
      width = dimensions.width;
      height = dimensions.height;
    });

    viewer.addHandler('update-viewport', redraw);

    const onStoreChange = ((event: StoreChangeEvent<ImageAnnotation>) => {
      annotations = event.state;
      redraw();
    });

    store.observe(onStoreChange);

    const onCopy = (evt: ClipboardEvent) => {
      const unformatted = document.getSelection()!.toString();

      // @ts-ignore
      const clipboardData = evt.clipboardData || window.clipboardData;  
      clipboardData.setData('text/plain', unformatted);
      clipboardData.setData('text/html', unformatted);

      evt.preventDefault();
    }

    document.addEventListener('copy', onCopy);

    return () => {
      viewer.removeHandler('update-viewport', redraw);

      store.unobserve(onStoreChange);

      document.removeEventListener('copy', onCopy);
    }
  });
</script>

{#if visible}
  <div 
    style={`transform:${transform}; width: ${width}px; height: ${height}px; font-size: ${fontSize}px;`}
    class="a9s-annotationlayer a9s-osd-textlayer"
    class:fixed-screen-size={opts.mode === 'fixedScreenSize' || (!opts.mode)}
    class:fixed-page-size={opts.mode === 'fixedPageSize'}
    class:fill-bounds={opts.mode === 'fillBounds'}
    class:bottomleft={opts.position !== 'topleft'}
    class:topleft={opts.position === 'topleft'}
    class:pointer-events={captureEvents}>
    {#if opts.mode === 'fixedScreenSize' || (!opts.mode)}
      {#each annotations as annotation}
        <FixedScreenSizeLabel 
          annotation={annotation} 
          opts={opts} 
          imageSize={[width, height]}
          scale={scale} />
      {/each}
    {:else if opts.mode === 'fixedPageSize'}
      {#each annotations as annotation}
        <FixedPageSizeLabel 
          annotation={annotation} 
          opts={opts} />
      {/each}
    {:else if opts.mode === 'fillBounds'}
      {#each annotations as annotation}
        <FillBoundsLabel 
          annotation={annotation} 
          opts={opts} />
      {/each}
    {/if}
  </div>
{/if}
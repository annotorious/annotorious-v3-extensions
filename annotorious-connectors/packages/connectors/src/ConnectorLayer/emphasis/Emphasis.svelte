<script lang="ts">
  import { ShapeType } from '@annotorious/annotorious';
  import Ellipse from './EmphasisEllipse.svelte';
  import Polygon from './EmphasisPolygon.svelte';
  import Rectangle from './EmphasisRectangle.svelte';

  export let annotation;
</script>

{#if (annotation.target.selector.type === ShapeType.ELLIPSE)}
  <Ellipse annotation={annotation} />
{:else if (annotation.target.selector.type === ShapeType.RECTANGLE)}
  <Rectangle annotation={annotation} />
{:else if (annotation.target.selector.type === ShapeType.POLYGON)}
  <Polygon annotation={annotation} />
{/if}

<style>
  :global(.a9s-annotation-emphasis :is(cirlc, polygon, rect)) {
    fill: transparent;
    stroke: #cc23cc;
    stroke-width: 2px;
    vector-effect: non-scaling-stroke;
  }
</style>
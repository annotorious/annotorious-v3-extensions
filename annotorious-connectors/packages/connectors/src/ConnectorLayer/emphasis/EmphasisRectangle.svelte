<script lang="ts">
  import type { ImageAnnotation, RectangleGeometry } from '@annotorious/annotorious';

  export let annotation: ImageAnnotation;

  $: ({ x, y, w, h } = annotation.target.selector.geometry as RectangleGeometry);
</script>

<g class="a9s-annotation-emphasis" data-id={annotation.id}>
  <rect
    x={x} 
    y={y} 
    width={w} 
    height={h} />
</g>

<style>
  .a9s-annotation-emphasis rect {
    fill: transparent;
    stroke: #cc23cc;
    stroke-width: 2px;
  }
</style>
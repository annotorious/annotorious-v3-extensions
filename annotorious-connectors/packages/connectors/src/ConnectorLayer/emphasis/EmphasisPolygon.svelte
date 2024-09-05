<script lang="ts">
  import type { ImageAnnotation, PolygonGeometry } from '@annotorious/annotorious';

  export let annotation: ImageAnnotation;

  $: ({ points } = annotation.target.selector.geometry as PolygonGeometry);
</script>

<g class="a9s-annotation-emphasis" data-id={annotation.id}>
  <polygon
    points={points.map(xy => xy.join(',')).join(' ')}  />
</g>


<script lang="ts">
  import type { ImageAnnotation, EllipseGeometry } from '@annotorious/annotorious';

  export let annotation: ImageAnnotation;

  $: ({ cx, cy, rx, ry } = annotation.target.selector.geometry as EllipseGeometry);
</script>

<g class="a9s-annotation-emphasis" data-id={annotation.id}>
  <ellipse
    cx={cx} 
    cy={cy} 
    rx={rx} 
    ry={ry} />
</g>


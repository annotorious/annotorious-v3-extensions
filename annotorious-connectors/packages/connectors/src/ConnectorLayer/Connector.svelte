<script lang="ts">
  import { onMount } from 'svelte';
  import type { SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import { computePath, getConnection } from '../layout';
  import type { ConnectionAnnotation } from 'src/model';

  /** Props */
  export let annotation: ConnectionAnnotation;
  export let state: SvelteImageAnnotatorState;
  export let isSelected: boolean;
  export let scale: number;

  const { selection, store } = state;

  $: r = 5 / scale;

  const computeConnection = (annotation: ConnectionAnnotation) =>
    getConnection(
      store.getAnnotation(annotation.target.selector.from)!, 
      store.getAnnotation(annotation.target.selector.to)!);

  $: connection = computeConnection(annotation);

  const onPointerDown = (evt: PointerEvent) => selection.userSelect(annotation.id, evt);

  onMount(() => {
    const onChange = () => connection = computeConnection(annotation);

    // Observe changes to start- and end-annotation
    const { from , to } = annotation.target.selector;
    store.observe(onChange, { annotations: [from, to]});

    return () => {
      store.unobserve(onChange);
    }
  });
</script>

<g class="a9s-connector">
  {#if connection}
    {@const path = computePath(connection, 10)}
    <path 
      class="a9s-connector-path-buffer"
      class:selected={isSelected}
      d={path.d} 
      on:pointerdown={onPointerDown} />

    <path class="a9s-connector-path-outer" d={path.d} />  
    <path class="a9s-connector-path-inner" d={path.d} />

    <circle class="a9s-connector-handle-outer" cx={path.start.x} cy={path.start.y} r={r} />
    <circle class="a9s-connector-handle-inner" cx={path.start.x} cy={path.start.y} r={r} />

    <circle class="a9s-connector-handle-outer" cx={path.end.x} cy={path.end.y} r={r} />
    <circle class="a9s-connector-handle-inner" cx={path.end.x} cy={path.end.y} r={r} />
  {/if}
</g>

<style>
  .a9s-connector path {
    fill: transparent;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  path.a9s-connector-path-buffer {
    cursor: pointer;
    pointer-events:all;
    stroke: rgba(255, 255, 255, 0);
    stroke-width: 8px;
    transition: stroke 125ms ease-in-out;
  }

  path.a9s-connector-path-buffer.selected {
    stroke: rgba(255, 255, 255, 0.5);
  }

  path.a9s-connector-path-buffer:hover:not(.selected) {
    stroke: rgba(255, 255, 255, 0.25);
  }

  path.a9s-connector-path-outer {
    stroke: #00000040;
    stroke-width: 3.5px;
  }

  path.a9s-connector-path-inner {
    stroke: #fff;
    stroke-width: 1.5px;
    stroke-dasharray: 3 3;
  }

  circle.a9s-connector-handle-outer {
    fill: #00000040;
    stroke: #00000040;
    stroke-width: 3;
    vector-effect: non-scaling-stroke;
  }

  circle.a9s-connector-handle-inner {
    fill: #000;
    stroke: #fff;
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }
</style>
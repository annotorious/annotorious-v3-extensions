<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { Annotation, ImageAnnotation, ImageAnnotatorState, StoreChangeEvent } from '@annotorious/annotorious';
  import { getConnection } from '../layout';
  import type { Connection, ConnectionAnnotation, ConnectionHandle, PinnedConnectionHandle, Point } from '../model';
  import { Emphasis } from './emphasis';
  import Connector from './Connector.svelte';
  import RubberbandConnector from './RubberbandConnector.svelte';

	const dispatch = createEventDispatcher<{ create: ConnectionAnnotation }>();

  /** Props */
  export let enabled: boolean;
  export let state: ImageAnnotatorState<ImageAnnotation>;
  export let layerTransform: string | undefined = undefined;
  export let pointerTransform: ((point: Point) => Point) | undefined = undefined;
  export let scale = 1;

  let source: ImageAnnotation | undefined;

  let hovered: ImageAnnotation | undefined;

  let connections: ConnectionAnnotation[] = [];

  let connectionRefs: { [key: string]: Connector } = {};

  let floatingConnection: Connection | undefined;

  $: if (!enabled) source = undefined;

  $: if (!source) floatingConnection = undefined;

  let svgEl: SVGSVGElement;

  const { selection, store } = state;

  export const getMidpoint = (id: string) => {
    const component = connectionRefs[id];
    if (component)
      return component.getMidpoint();
  }

  const isPinned = (handle?: ConnectionHandle): handle is PinnedConnectionHandle => 
    handle !== undefined && 'direction' in handle;

  const onPointerDown = (evt: PointerEvent) => {
    selection.clear();

    if (!source && hovered) {
      source = hovered;
    } else if (isPinned(floatingConnection?.end)) {
      evt.preventDefault();
      evt.stopPropagation();

      const from = floatingConnection.start.annotation.id;
      const to = floatingConnection.end.annotation.id;

      const id = uuidv4();

      const annotation: ConnectionAnnotation = {
        id,
        motivation: 'linking',
        bodies: [],
        target: {
          annotation: id,
          selector: { from, to }
        }
      }

      // @ts-ignore
      store.addAnnotation(annotation);

      source = undefined;

      dispatch('create', annotation);

      selection.setSelected(annotation.id);
    } else if (source) {
      source = undefined;
    }
  }

  const onPointerMove = (evt: PointerEvent) => {

    const pt: Point = pointerTransform 
        ? pointerTransform({ x: evt.offsetX, y: evt.offsetY })
        : getSVGPoint(evt, svgEl);

    const h = store.getAt(pt.x, pt.y);

    if (source) {
      // Source defined - pick target
      if (h)
        floatingConnection = getConnection(source, h);
      else
        floatingConnection = getConnection(source, { point: pt });
    }

    hovered = h;
  }

  onMount(() => {
    const onChange = (event: StoreChangeEvent<Annotation>) => {
      const { created, updated, deleted } = event.changes;

      // @ts-ignore
      const addedConnections: ConnectionAnnotation[] = (created || []).filter(a => a.motivation === 'linking');
      connections = [...connections, ...addedConnections];
    }

    store.observe(onChange);

    return () => {
      store.unobserve(onChange);
    }
  });

  // Shorthand
  $: isSelected = (id: string) => $selection.selected.some(s => s.id === id);
</script>

<svg 
  bind:this={svgEl}
  class="a9s-connector-layer"
  class:enabled={enabled}
  class:hover={hovered}
  on:pointermove={onPointerMove}
  on:pointerdown={onPointerDown}>
  <g class="a9s-connectors-layer" transform={layerTransform}>
    <g class="a9s-connectors-shape-emphasis">
      {#if enabled}
        {#if source}
          <Emphasis annotation={source} />
        {/if}

        {#if hovered && hovered !== source}
          <Emphasis annotation={hovered} />
        {/if}
      {/if}

      {#if floatingConnection?.end && 'annotation' in floatingConnection.end}
        <Emphasis annotation={floatingConnection.end.annotation} />
      {/if}
    </g>

    <g class="a9s-connectors">
      {#each connections as connection}
        <Connector
          bind:this={connectionRefs[connection.id]}
          annotation={connection}
          scale={scale}
          state={state} 
          isSelected={isSelected(connection.id)}/>
      {/each}
    </g>

    {#if floatingConnection}
      <g class="a9s-floating">
        <RubberbandConnector 
          connection={floatingConnection} 
          scale={scale} />
      </g>
    {/if}
  </g>
</svg>

<style>
  svg {
    height: 100%;
    left: 0px;
    position: absolute;
    top: 0px;
    pointer-events: none;
    width: 100%;
  }

  svg.enabled {
    pointer-events: all;
  }

  svg.hover {
    cursor: pointer;
  }
</style>

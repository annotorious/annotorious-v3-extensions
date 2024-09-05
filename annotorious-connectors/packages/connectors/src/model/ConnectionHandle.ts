import type { ImageAnnotation } from '@annotorious/annotorious';
import type { Point } from './Point';

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface FloatingConnectionHandle {

  point: Point;

}

export interface PinnedConnectionHandle extends FloatingConnectionHandle {

  annotation: ImageAnnotation;

  direction: Direction;

}

export type ConnectionHandle = FloatingConnectionHandle | PinnedConnectionHandle;
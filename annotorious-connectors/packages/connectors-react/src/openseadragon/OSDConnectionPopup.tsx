import { ReactNode, useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { AnnotoriousOpenSeadragonAnnotator, useAnnotator, useViewer } from '@annotorious/react';
import { useConnectionSelection, usePopupCallbacks } from '../hooks';
import { ConnectionPopupProps } from '../ConnectionPopupProps';
import {
  useFloating,
  arrow,
  shift,
  inline,
  autoUpdate,
  flip,
  offset,
  FloatingArrow
} from '@floating-ui/react';

interface OSDConnectionPopupProps {

  popup(props: ConnectionPopupProps): ReactNode;

}

export const OSDConnectionPopup = (props: OSDConnectionPopupProps) => {

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const [isOpen, setIsOpen] = useState(false);

  const viewer = useViewer();

  const arrowRef = useRef(null);

  const { annotation, midpoint } = useConnectionSelection();

  const { onCreateBody, onDeleteBody, onUpdateBody } = usePopupCallbacks(annotation);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      inline(), 
      offset(10),
      flip({ crossAxis: true }),
      shift({ 
        crossAxis: true,
        boundary: viewer?.element,
        padding: { right: 5, left: 5, top: 10, bottom: 10 }
      }),
      arrow({
        element: arrowRef,
        padding: 5
      })
    ],
    whileElementsMounted: autoUpdate
  });

  useEffect(() => {
    if (annotation) {  
      const setPosition = () => { 
        const { left, top } = viewer.element.getBoundingClientRect();

        const pt = viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(midpoint.x, midpoint.y));

        const x = pt.x + left;
        const y = pt.y + top;

        const rect = {
          x,
          y,
          width: 0,
          height: 0,
          top: y,
          right: x,
          bottom: y,
          left: x
        }
        
        refs.setReference({
          getBoundingClientRect: () => rect,
          getClientRects: () => [rect]
        });
      }

      window.addEventListener('scroll', setPosition, true);
      window.addEventListener('resize', setPosition);
      viewer.addHandler('update-viewport', setPosition);

      setPosition();

      setIsOpen(true);

      return () => {
        window.removeEventListener('scroll', setPosition, true);
        window.removeEventListener('resize', setPosition);
        viewer.removeHandler('update-viewport', setPosition);
      };
    } else {
      setIsOpen(false);
    }
  }, [anno, annotation, midpoint, viewer]);

  return isOpen && annotation && (
    <div 
      className="a9s-connection-popup a9s-openseadragon-connection-popup"
      ref={refs.setFloating}
      style={floatingStyles}>

      <FloatingArrow 
        ref={arrowRef} 
        context={context} />

      {props.popup({
        annotation,
        onCreateBody,
        onDeleteBody,
        onUpdateBody
      })}
    </div>
  )

}
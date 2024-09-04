import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAnnotator } from '@annotorious/react';
import { ImageAnnotator } from '@annotorious/annotorious';
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

interface ConnectionPopupContainerProps {

  popup(props: ConnectionPopupProps): ReactNode;

}

export const ConnectionPopup = (props: ConnectionPopupContainerProps) => {

  const arrowRef = useRef(null);

  const anno = useAnnotator<ImageAnnotator>();

  const { annotation, midpoint } = useConnectionSelection();

  const [isOpen, setIsOpen] = useState(false);

  const { onCreateBody, onDeleteBody, onUpdateBody } = usePopupCallbacks(annotation);

  const { refs, floatingStyles, context, update } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      inline(), 
      offset(10),
      flip({ crossAxis: true }),
      shift({ 
        crossAxis: true,
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
        const { left, top } = anno.element.getBoundingClientRect();

        const x = midpoint.x + left;
        const y = midpoint.y + top;

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

      setPosition();

      setIsOpen(true);

      return () => {
        window.removeEventListener('scroll', setPosition, true);
        window.removeEventListener('resize', setPosition);
      };
    } else {
      setIsOpen(false);
    }
  }, [anno, annotation, midpoint]);

  return isOpen && annotation && (
    <div 
      className="a9s-connection-popup"
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
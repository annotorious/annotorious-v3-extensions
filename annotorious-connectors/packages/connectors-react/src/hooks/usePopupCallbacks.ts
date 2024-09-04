import { Annotation, AnnotationBody, Annotator, ImageAnnotation, useAnnotator } from '@annotorious/react';
import { v4 as uuidv4 } from 'uuid';

export const usePopupCallbacks = (annotation: Annotation) => {

  const anno = useAnnotator<Annotator<ImageAnnotation>>();

  const onCreateBody = (body: Partial<AnnotationBody>) => {
    const id = body.id || uuidv4();
    
    anno.state.store.addBody({
      ...body,
      id,
      annotation: annotation.id,
      created: body.created || new Date(),
      creator: anno.getUser()
    });
  }

  const onDeleteBody = (id: string) => {
    anno.state.store.deleteBody({ id, annotation: annotation.id });
  }

  const onUpdateBody = (current: AnnotationBody, next: AnnotationBody) => {
    const id = next.id || uuidv4();

    const updated: AnnotationBody = {
      updated: new Date(),
      updatedBy: anno.getUser(),
      ...next,
      id,
      annotation: annotation.id
    }

    anno.state.store.updateBody(current, updated);
  }

  return {
    onCreateBody, 
    onDeleteBody,
    onUpdateBody
  }

}
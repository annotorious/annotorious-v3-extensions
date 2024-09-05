import React, { useEffect, useState } from 'react';
import { ImageAnnotator, useAnnotator } from '@annotorious/react';
import { W3CImageRelationFormat } from '@annotorious/plugin-connectors'; 
import { ConnectionPopup, ConnectorPlugin } from '../src';

export const App = () => {

  const [mode, setMode] = useState<'ANNOTATE' | 'RELATIONS'>('ANNOTATE');

  const anno = useAnnotator();

  useEffect(() => {
    if (!anno) return;

    anno.loadAnnotations('annotations.json');
  }, [anno]);

  return (
    <div id="content">
      <div>
        <button onClick={() => setMode(mode => mode === 'ANNOTATE' ? 'RELATIONS' : 'ANNOTATE')}>
          {mode === 'ANNOTATE' ? 'Annotate' : 'Relations'}
        </button>
      </div>

      <ImageAnnotator
        // @ts-ignore
        adapter={W3CImageRelationFormat('640px-Hallstatt.jpg')}>
        <img src="640px-Hallstatt.jpg" />
      </ImageAnnotator>

      <ConnectorPlugin 
        enabled={mode === 'RELATIONS'}>

        <ConnectionPopup 
          popup={() => (
            <div>Hello World</div>
          )} />

      </ConnectorPlugin>
    </div>
  )

}
import React, { useEffect, useState } from 'react';
import { 
  AnnotoriousOpenSeadragonAnnotator, 
  DrawingStyle, 
  OpenSeadragonAnnotator, 
  OpenSeadragonViewer, 
  useAnnotator,
} from '@annotorious/react';
import { W3CImageRelationFormat } from '@annotorious/plugin-connectors'; 
import { OSDConnectionPopup, OSDConnectorPlugin} from '../../src';

import '@annotorious/openseadragon/annotorious-openseadragon.css';
import '@annotorious/plugin-connectors/annotorious-connectors.css';
import { DemoLabelPopup } from './DemoLabelPopup';

const IIIF_SAMPLE = {
  "@context" : "http://iiif.io/api/image/2/context.json",
  "protocol" : "http://iiif.io/api/image",
  "width" : 7808,
  "height" : 5941,
  "sizes" : [
     { "width" : 244, "height" : 185 },
     { "width" : 488, "height" : 371 },
     { "width" : 976, "height" : 742 }
  ],
  "tiles" : [
     { "width" : 256, "height" : 256, "scaleFactors" : [ 1, 2, 4, 8, 16, 32 ] }
  ],
  "@id" : "https://iiif.bodleian.ox.ac.uk/iiif/image/af315e66-6a85-445b-9e26-012f729fc49c",
  "profile" : [
     "http://iiif.io/api/image/2/level2.json",
     { "formats" : [ "jpg", "png", "webp" ],
       "qualities" : ["native","color","gray","bitonal"],
       "supports" : ["regionByPct","regionSquare","sizeByForcedWh","sizeByWh","sizeAboveFull","sizeUpscaling","rotationBy90s","mirroring"],
       "maxWidth" : 1000,
       "maxHeight" : 1000
     }
  ]
};

const style = {
  fill: '#00cc00',
  fillOpacity: 0.25,
  stroke: '#00cc00',
  strokeOpacity: 1,
  strokeWidth: 2
} as DrawingStyle;

const OSD_OPTIONS: OpenSeadragon.Options = {
  prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/',
  tileSources: IIIF_SAMPLE,
  crossOriginPolicy: 'Anonymous',
  showRotationControl: true,
  gestureSettingsMouse: {
    clickToZoom: false
  }
};

export const App = () => {

  const [mode, setMode] = useState<'MOVE' | 'ANNOTATE' | 'RELATIONS'>('MOVE');

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const [relationsEnabled, setRelationsEnabled] = useState(false);

  useEffect(() => {
    if (!anno) return;

    anno.loadAnnotations('annotations.json');

    anno.on('createAnnotation', a => console.log(a));
    anno.on('updateAnnotation', a => console.log(a));
  }, [anno]);

  const toggleMode = () => setMode(mode => 
    mode === 'MOVE' ? 'ANNOTATE' :
    mode === 'ANNOTATE' ? 'RELATIONS' :
    'MOVE');

  useEffect(() => {
    if (!anno) return;

    anno.setDrawingEnabled(mode === 'ANNOTATE');
    setRelationsEnabled(mode === 'RELATIONS');
  }, [anno, mode]);

  return (
    <div>
      <div className="buttons">
        <button onClick={toggleMode}>
          {mode}
        </button>
      </div>

      <OpenSeadragonAnnotator 
        // @ts-ignore
        adapter={W3CImageRelationFormat(
          'https://iiif.bodleian.ox.ac.uk/iiif/image/af315e66-6a85-445b-9e26-012f729fc49c')}
        style={style}>

        <OpenSeadragonViewer className="openseadragon" options={OSD_OPTIONS} />
        
        <OSDConnectorPlugin 
          enabled={relationsEnabled}>

          <OSDConnectionPopup
            popup={props => (<DemoLabelPopup {...props} />)} />
        </OSDConnectorPlugin>
      </OpenSeadragonAnnotator>
    </div>
  )

}
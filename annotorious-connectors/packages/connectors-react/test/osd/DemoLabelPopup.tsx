import React from 'react';
import { ConnectionPopupProps } from '../../src';

const RELATIONS = ['is next to', 'is behind', 'is before'];

export const DemoLabelPopup = (props: ConnectionPopupProps) => {

  const value = props.annotation.bodies.find(b => b.purpose === 'tagging')?.value;

  const onChange = (value: string) => {
    const existing = props.annotation.bodies.find(b => b.purpose === 'tagging');
    if (existing) {
      props.onUpdateBody(existing, { purpose: 'tagging', value });
    } else {
      props.onCreateBody({ purpose: 'tagging', value });
    }
  }

  return (
    <div>
      <select 
        value={value}
        onChange={evt => onChange(evt.target.value)}>
        {RELATIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  )

}
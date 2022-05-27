import React from 'react';
import field from '../assets/images/empty_field.svg';

export default function Field() {
  return (
    <img src={field} className="field" alt="Empty soccer field" />
  );
}
import React from 'react';

import './FormInput.scss';

const FormInput = ({ handleChange, label, stuff, ...otherProps }) => {
  const hasText = otherProps.value.length > 0;
  const labelClasses = `${hasText ? 'shrink' : ''} form-input-label`;

  return (
    <div className='group'>
      <input className='form-input' onChange={handleChange} {...otherProps} />
      {label ? <label className={labelClasses}>{label}</label> : null}
    </div>
  );
};

export default FormInput;

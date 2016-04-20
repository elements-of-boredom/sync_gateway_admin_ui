import React, { PropTypes } from 'react';

const BoxHeader = (props) => {
  return (
    <div className="box-header with-border">
      <h3 className="box-title">{props.title}</h3>
      {props.children}
    </div>
  );
}

export default BoxHeader;

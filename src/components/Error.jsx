import React from 'react';

function Error({ message }) {
  return (
    <div className="error">
      <p>{message}</p>
    </div>
  );
}

export default Error;

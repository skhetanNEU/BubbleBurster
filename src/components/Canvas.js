// src/components/Canvas.js
import React, { forwardRef } from 'react';

const Canvas = forwardRef((props, ref) => (
  <canvas id="gameCanvas" width="800" height="600" ref={ref} onClick={props.onClick} />
));

export default Canvas;

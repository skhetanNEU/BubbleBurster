// src/components/Canvas.js
import React, { forwardRef } from 'react';

const Canvas = forwardRef((props, ref) => (
  <canvas id="gameCanvas" width="1200" height="500" ref={ref} onClick={props.onClick} />
));

export default Canvas;

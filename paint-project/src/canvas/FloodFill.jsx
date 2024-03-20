

const FloodFiller = (props) => {
    function getPixel(pixelData, x, y) {
  if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
    return -1;  // impossible color
  } else {
    return pixelData.data[y * pixelData.width + x];
    }
    }

    function floodFill(ctx, x, y, fillColor) {
  // read the pixels in the canvas
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // make a Uint32Array view on the pixels so we can manipulate pixels
  // one 32bit value at a time instead of as 4 bytes per pixel
    const pixelData = {
        width: imageData.width,
        height: imageData.height,
        data: new Uint32Array(imageData.data.buffer),
    };
  
  // get the color we're filling
  const targetColor = getPixel(pixelData, x, y);
  
  // check we are actually filling a different color
  if (targetColor !== fillColor) {
  
    const pixelsToCheck = [x, y];
    while (pixelsToCheck.length > 0) {
      const y = pixelsToCheck.pop();
      const x = pixelsToCheck.pop();
      
      const currentColor = getPixel(pixelData, x, y);
      if (currentColor === targetColor) {
        pixelData.data[y * pixelData.width + x] = fillColor;
        pixelsToCheck.push(x + 1, y);
        pixelsToCheck.push(x - 1, y);
        pixelsToCheck.push(x, y + 1);
        pixelsToCheck.push(x, y - 1);
      }
    }
    
    // put the data back
    ctx.putImageData(imageData, 0, 0);
  }
}
}

export default FloodFiller;
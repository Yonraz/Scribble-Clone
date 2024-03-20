export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      }
    : null;
  return rgb;
};

export const getEuclidianDistanceForColors = (startColor, newColor) => {
  const startR = startColor.r / 1.0;
  const startG = startColor.g / 1.0;
  const startB = startColor.b / 1.0;
  const startA = startColor.a / 1.0;

  const newR = newColor.r / 1.0;
  const newG = newColor.g / 1.0;
  const newB = newColor.b / 1.0;
  const newA = newColor.a / 1.0;

  if (isEqualColor(startColor, newColor)) return 0;
  const dist = Math.sqrt(
    Math.pow(startR - newR, 2) +
      Math.pow(startG - newG, 2) +
      Math.pow(startB - newB, 2) +
      Math.pow(startA - newA, 2)
  );
  return dist;
};

const isIndexOutOfRange = (x, y, width, height) => {
  return x < 0 || x >= width || y < 0 || y >= height;
};

export const isSmoothedBorder = (
  pixelIJ,
  startColor,
  imageData,
  initialEuclidianDist
) => {
  const [i, j] = pixelIJ;
  const pixelStack = [];
  pixelStack.push([i + 1, j]);
  pixelStack.push([i - 1, j]);
  pixelStack.push([i, j + 1]);
  pixelStack.push([i, j - 1]);
  while (pixelStack.length > 0) {
    const [pixelX, pixelY] = pixelStack.pop();
    if (isIndexOutOfRange(pixelX, pixelY, imageData.width, imageData.height)) {
      continue;
    }
    const pixelPosition = (pixelY * imageData.width + pixelX) * 4;
    const pixelColor = getColorFromPixelPosition(pixelPosition, imageData);
    const newDist = getEuclidianDistanceForColors(startColor, pixelColor);
    if (newDist < initialEuclidianDist) return true;
  }
  return false;
};

const isEqualColor = (color1, color2) => {
  return (
    color1.r === color2.r &&
    color1.g === color2.g &&
    color1.b === color2.b &&
    color1.a === color2.a
  );
};

const getColorFromPixelPosition = (pixelPos, imageData) => {
  const r = imageData.data[pixelPos];
  const g = imageData.data[pixelPos + 1];
  const b = imageData.data[pixelPos + 2];
  const a = imageData.data[pixelPos + 3];
  return {
    r,
    g,
    b,
    a,
  };
};

export const matchStartColor = (pixelPos, startColor, imageData, threshold) => {
  const newColor = getColorFromPixelPosition(pixelPos, imageData);
  const dist = getEuclidianDistanceForColors(startColor, newColor);
  if (threshold === 255) return dist <= 128;
  return dist < threshold - 5;
};

// if new color equals start color
// check positions around new color
// if color changes around (higher euclidian distance), color is same

export const floodFill = (ctx, originalX, originalY, fillColor) => {
  fillColor = hexToRgb(fillColor);
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const pixelStack = [[originalX, originalY]];
  const pixelPosition = (x, y) => {
    return (y * imageData.width + x) * 4;
  };

  const colorPixel = (pixelPos, fillColor) => {
    imageData.data[pixelPos] = fillColor.r;
    imageData.data[pixelPos + 1] = fillColor.g;
    imageData.data[pixelPos + 2] = fillColor.b;
    imageData.data[pixelPos + 3] = 255;
  };
  const startColor = {
    r: imageData.data[pixelPosition(originalX, originalY)],
    g: imageData.data[pixelPosition(originalX, originalY) + 1],
    b: imageData.data[pixelPosition(originalX, originalY) + 2],
    a: imageData.data[pixelPosition(originalX, originalY) + 3],
  };

  const initialEuclidianDist = getEuclidianDistanceForColors(startColor, fillColor);

  if (isEqualColor(startColor, fillColor)) return;

  while (pixelStack.length) {
    let [i, j] = pixelStack.pop();
    let pixelPos = (j * imageData.width + i) * 4;
    // check pixel in range
    if (isIndexOutOfRange(i, j, ctx.canvas.width, ctx.canvas.height)) {
      continue;
    } else {
      // check pixel color matches start color
      if (
        !matchStartColor(pixelPos, startColor, imageData, initialEuclidianDist)
      ) {
        // const pixelIJ = [i, j];
        // if (
        //   isSmoothedBorder(pixelIJ, startColor, imageData, initialEuclidianDist)
        // ) {
        //   colorPixel(pixelPos, fillColor);
        // }
        continue;
      }
      colorPixel(pixelPos, fillColor);
      pixelStack.push([i + 1, j]);
      pixelStack.push([i - 1, j]);
      pixelStack.push([i, j + 1]);
      pixelStack.push([i, j - 1]);
    }
  }
  return imageData;
};

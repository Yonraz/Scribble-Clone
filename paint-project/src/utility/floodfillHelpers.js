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

export const getEuclideanDistanceForColors = (startColor, newColor) => {
  if (isEqualColor(startColor, newColor)) return 0;
  if (startColor.a === newColor.a)
    return Math.sqrt(
      Math.pow(startColor.r - newColor.r, 2) +
        Math.pow(startColor.g - newColor.g, 2) +
        Math.pow(startColor.b - newColor.b, 2)
    );
  const dist = Math.sqrt(
    Math.pow(startColor.r - newColor.r, 2) +
      Math.pow(startColor.g - newColor.g, 2) +
      Math.pow(startColor.b - newColor.b, 2) +
      Math.pow(startColor.a - newColor.a, 2)
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
  const processedPixels = new Set();
  pixelStack.push([i + 1, j]);
  pixelStack.push([i - 1, j]);
  pixelStack.push([i, j + 1]);
  pixelStack.push([i, j - 1]);
  while (pixelStack.length > 0) {
    const [pixelX, pixelY] = pixelStack.pop();
    const pixelPosition = (pixelY * imageData.width + pixelX) * 4;
    if (
      isIndexOutOfRange(pixelX, pixelY, imageData.width, imageData.height) ||
      processedPixels.has(pixelPosition)
    ) {
      continue;
    }
    processedPixels.add(pixelPosition);
    const pixelColor = getColorFromPixelPosition(pixelPosition, imageData);
    const newDist = getEuclideanDistanceForColors(startColor, pixelColor);
    if (newDist < 150)
      console.log(
        `original: ${JSON.stringify(startColor)}, new: ${JSON.stringify(
          pixelColor
        )}, dist: ${newDist}`
      );
    if (pixelColor.a < 255 || newDist < initialEuclidianDist - 70) return true;
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

export const matchStartColor = (pixelPos, startColor, imageData) => {
  const newColor = getColorFromPixelPosition(pixelPos, imageData);
  const dist = getEuclideanDistanceForColors(startColor, newColor);
  if (dist < 110)
    console.log(
      `original: ${JSON.stringify(startColor)}, new: ${JSON.stringify(
        newColor
      )}, dist: ${dist}`
    );
  // if (threshold === 510) return dist <= 255;
  return dist < 15;
};

// if new color equals start color
// check positions around new color
// if color changes around (higher euclidian distance), color is same

export const floodFill = (ctx, originalX, originalY, fillColor) => {
  fillColor = hexToRgb(fillColor);
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const pixelStack = [[originalX, originalY]];
  const processedPixels = new Set();
  const pixelPosition = (x, y) => {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    return (floorY * imageData.width + floorX) * 4;
  };

  const colorPixel = (pixelPos, fillColor) => {
    imageData.data[pixelPos] = fillColor.r;
    imageData.data[pixelPos + 1] = fillColor.g;
    imageData.data[pixelPos + 2] = fillColor.b;
    imageData.data[pixelPos + 3] = 255;
  };
  const initialPixelPosition = pixelPosition(originalX, originalY);
  const startColor = getColorFromPixelPosition(initialPixelPosition, imageData);
  const initialEuclideanDist = getEuclideanDistanceForColors(
    startColor,
    fillColor
  );
  console.log(`Start Color: ${JSON.stringify(startColor)}`);
  console.log(`Fill Color: ${JSON.stringify(fillColor)}`);
  console.log(`Initial Euclidean Distance: ${initialEuclideanDist}`);

  if (isEqualColor(startColor, fillColor)) return;

  while (pixelStack.length) {
    let [i, j] = pixelStack.pop();
    let pixelPos = pixelPosition(i, j);
    // check pixel in range
    if (
      isIndexOutOfRange(i, j, imageData.width, imageData.height) ||
      processedPixels.has(pixelPos)
    ) {
      continue;
    }
    processedPixels.add(pixelPos);
    // check pixel color matches start color
    if (
      matchStartColor(pixelPos, startColor, imageData, initialEuclideanDist) ||
      isSmoothedBorder([i, j], startColor, imageData, initialEuclideanDist)
    ) {
      colorPixel(pixelPos, fillColor);
      pixelStack.push([i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]);
    }
  }

  return imageData;
};

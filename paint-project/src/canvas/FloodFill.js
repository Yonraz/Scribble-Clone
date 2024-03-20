const canvas = [
  [0, 0, 2, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 0, 2, 1, 0],
  [0, 1, 1, 2, 2, 2, 1, 0],
  [0, 1, 1, 2, 0, 2, 1, 0],
  [0, 1, 1, 2, 2, 2, 1, 2],
  [0, 1, 1, 2, 4, 1, 1, 0],
  [0, 1, 1, 2, 2, 1, 1, 0],
  [0, 0, 0, 0, 2, 2, 2, 0],
];

const floodFill = (x, y, newVal) => {
  const n = canvas.length;
  const m = canvas[0].length;
  const oldVal = canvas[x][y];
  if (oldVal === newVal) return;
  const queue = [];
  queue.push([x, y]);
  while (queue.length) {
    let [x, y] = queue.shift();
    if (x < 0 || x >= n || y < 0 || y >= m || canvas[x][y] != oldVal) {
      continue;
    } else {
      canvas[x][y] = newVal;
      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }
  }
};

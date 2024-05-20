export function reOrderRandomly<T>(items: T[]): T[] {
  const result = [];
  while (items.length > 0) {
    let randomIndex = Math.floor(Math.random() * items.length);
    result.push(items[randomIndex]);
    items.splice(randomIndex, 1);
  }
  return result;
}

export function chunk<T>(items: T[], chunkSize: number): T[][] {
  const result = [];
  while (items.length > 0) {
    result.push(items.splice(0, chunkSize));
  }
  return result;
}

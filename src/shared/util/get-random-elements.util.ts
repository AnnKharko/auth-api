export const getRandomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = arr.slice();
  const randomElements: T[] = [];

  while (randomElements.length < count && shuffled.length > 0) {
    const randomIndex = Math.floor(Math.random() * shuffled.length);
    randomElements.push(shuffled[randomIndex]);
    shuffled.splice(randomIndex, 1);
  }

  return randomElements;
};

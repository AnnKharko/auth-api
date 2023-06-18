export const getArrayOfNumbers = (num: number): number[] => {
  const numbers = [];
  for (let i = 1; i <= num; i++) {
    numbers.push(i);
  }
  return numbers;
};

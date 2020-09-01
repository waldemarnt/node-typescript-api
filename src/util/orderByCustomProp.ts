export default function <T>(current: T, next: T, customProp: keyof T): number {
  if (current[customProp] > next[customProp]) {
    return -1;
  }

  if (current[customProp] < next[customProp]) {
    return 1;
  }

  return 0;
}

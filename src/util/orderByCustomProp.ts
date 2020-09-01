export enum Ordination {
  ASC = 'asc',
  DESC = 'des',
}

export interface OrderByOptions<T> {
  customProp: keyof T;
  ordination: Ordination;
}

export default function <T>(
  current: T,
  next: T,
  { customProp, ordination }: OrderByOptions<T>
): number {
  if (ordination === Ordination.DESC) {
    if (current[customProp] > next[customProp]) {
      return -1;
    }

    if (current[customProp] < next[customProp]) {
      return 1;
    }
  }

  if (current[customProp] < next[customProp]) {
    return 1;
  }

  if (current[customProp] > next[customProp]) {
    return -1;
  }

  return 0;
}

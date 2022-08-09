const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const toCapitalizedList = (arr: string[]): string =>
  arr.map(capitalize).join(', ');

const joinAndCapitalizeItems = (input: string[] | string): string =>
  Array.isArray(input) ? toCapitalizedList(input) : capitalize(input);

const sortByKey =
  <T extends Record<string, unknown>>(key: string, direction: 'asc' | 'desc') =>
  (a: T, b: T) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return 0;
  };

interface ObjectWithMessageProperty {
  message: string;
  [key: string]: any;
}

const isErrorWithMessage = (e: unknown): e is ObjectWithMessageProperty => {
  return e !== null && typeof e === 'object' && 'message' in e;
};

export { capitalize, joinAndCapitalizeItems, sortByKey, isErrorWithMessage };

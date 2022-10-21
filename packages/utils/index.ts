export * from './sockets';
export function getAt<T>(array: T[], index: number): T {
    //Python style negative indexing
    if (index < 0) {
        index = array.length + index;
    }
    return array[index % array.length];
}

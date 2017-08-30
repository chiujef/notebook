export class ListCopy<T> extends Array<T> {
    copy(): Array<T> {
        return JSON.parse(JSON.stringify(this));
    }
}

export class CopyMessage {
    static copy(obj: any): any {
        if (obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        return null;
    }
}

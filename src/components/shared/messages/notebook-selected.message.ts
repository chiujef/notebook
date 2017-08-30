export class NotebookSelectedMessage {
    constructor(private _isSelected: boolean,
        private _notebookId: number
    ) { }

    get isSelected(): boolean {
        return this._isSelected;
    }

    get notebookId(): number {
        return this._notebookId;
    }
}

import { CopyMessage } from './copy-message';
import { Notebook } from '../models/notebook';


export const enum NotebookStoreOperation {
    None,
    Added,
    Retrieved,
    Updated,
    Deleted
}

export class NotebookStoreMessage extends CopyMessage {
    private _notebooks: Notebook[];

    constructor(private _operation: NotebookStoreOperation,
        private notebooksParam: Notebook[]
    ) {
        super();
        this._notebooks = CopyMessage.copy(notebooksParam);
    }

    get operation(): NotebookStoreOperation {
        return this._operation;
    }

    get notebooks(): Notebook[] {
        return this._notebooks;
    }
}

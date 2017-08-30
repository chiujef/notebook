import { CopyMessage } from './copy-message';
import { Notebook } from '../models/notebook';

export class NotebookSelectedMessage extends CopyMessage {
    private _notebook: Notebook;

    constructor(private _isSelected: boolean,
        private notebookParam: Notebook
    ) {
        super();
        this._notebook = CopyMessage.copy(notebookParam);
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    get notebook(): Notebook {
        return this._notebook;
    }
}

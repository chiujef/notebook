import { CopyMessage } from './copy-message';
import { Note } from '../models/note';


export const enum NoteStoreOperation {
    None,
    Added,
    Retrieved,
    Updated,
    Deleted
}

export class NoteStoreMessage extends CopyMessage {
    private _notes: Note[];

    constructor(private _operation: NoteStoreOperation,
        private notesParam: Note[]
    ) {
        super();
        this._notes = CopyMessage.copy(notesParam);
    }

    get operation(): NoteStoreOperation {
        return this._operation;
    }

    get notes(): Note[] {
        return this._notes;
    }
}

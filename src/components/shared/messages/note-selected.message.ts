import { CopyMessage } from './copy-message';
import { Note } from '../models/note';

export class NoteSelectedMessage extends CopyMessage {
    private _note: Note;

    constructor(private _isSelected: boolean,
        private _noteParam: Note
    ) {
        super();
        this._note = CopyMessage.copy(_noteParam);
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    get note(): Note {
        return this._note;
    }
}

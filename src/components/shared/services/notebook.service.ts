import { Inject, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Notebook } from '../models/notebook';

import { NOTEBOOK_API_URL } from '../config';


@Injectable()
export class NotebookService {
    constructor(private http: Http,
        @Inject(NOTEBOOK_API_URL) private apiUrl: string
    ) { }

    addNotebook(notebook: Notebook): Observable<Notebook> {
        return this.http
                .post(`${this.apiUrl}`, JSON.stringify(notebook))
                .map(
                    res => res.json().data as Notebook
                )
                .catch(this.handleError);
    }

    getAllNotebook(): Observable<Notebook[]> {
        return this.http
                .get(`${this.apiUrl}`)
                .map(
                    res => res.json().data as Notebook[]
                )
                .catch(this.handleError);
    }

    updateNotebook(notebook: Notebook): Observable<Notebook> {
        return this.http
                .put(`${this.apiUrl}/${notebook.id}`, JSON.stringify(notebook))
                .map(
                    res => res.json().data as Notebook
                )
                .catch(this.handleError);
    }

    deleteNotebook(notebookId: number): Observable<any> {
        return this.http
                .delete(`${this.apiUrl}/${notebookId}`)
                .map(
                    res => res.json().data
                )
                .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { IFloor } from '../models/floor';

@Injectable({
    providedIn: 'root'
})
export class FloorService {
    private floorUrl = "api/floors"; 

    constructor(private httpClient: HttpClient) {}

    getFloors(): Observable<IFloor[]> {
        return this.httpClient.get<IFloor[]>(this.floorUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError('getFloors', []))
        );
    }

    /** GET Floor by id. Will 404 if id not found */
    getFloor(id: number): Observable<IFloor> {
        const url = `${this.floorUrl}/${id}`;
        return this.httpClient.get<IFloor>(url).pipe(
        tap(data => console.log(`fetched Floor id=${id}`)),
        catchError(this.handleError<IFloor>(`getFloor id=${id}`))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
        };
    }
}
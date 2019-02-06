import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';

import { IProduct } from '../models/product';

const PRODUCT_CODES = ['ABC 1234'];

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productUrl = "api/products"; //"api/products.json";

    constructor(private httpClient: HttpClient) {}

    isProductCodeTaken(productCode: string): Observable<boolean> {
        const isTaken = PRODUCT_CODES.includes(productCode);
    
        return of(isTaken).pipe(delay(400));
    }

    getProducts(): Observable<IProduct[]> {
        return this.httpClient.get<IProduct[]>(this.productUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError('getProducts', []))
        );
    }

    /** GET product by id. Will 404 if id not found */
    getProduct(id: number): Observable<IProduct> {
        const url = `${this.productUrl}/${id}`;
        return this.httpClient.get<IProduct>(url).pipe(
        tap(data => console.log(`fetched product id=${id}`)),
        catchError(this.handleError<IProduct>(`getProduct id=${id}`))
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
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

export function getPaginationHeader(pageNumber: number, pageSize: number) {

    let params = new HttpParams();

    params = params.append("PageNumber", pageNumber.toString());
    params = params.append("PageSize", pageSize.toString());

    return params;
}

export function getPaginatedResult<T>(url: string, params: HttpParams, httpClient: HttpClient) {

    let paginatedResult: PaginatedResult<T> = new PaginatedResult<T>()

    return httpClient.get<T>(url, { observe: 'response', params }).pipe(
        map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get("Pagination") !== null) {
                paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
            }
            return paginatedResult;
        })
    );
}
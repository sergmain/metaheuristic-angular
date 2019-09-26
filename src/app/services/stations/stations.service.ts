import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from './urls';
import { Station } from './response';
import { environment } from '@src/environments/environment';
import { generateFormData } from '@src/app/helpers/generateFormData';

export * from './response';

@Injectable({ providedIn: 'root' })

export class StationsService {
    POST: any;
    GET: any;
    formData: any;
    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad${url}`;
        const POST: any = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        const GET: any = (url: string): Observable < any > => this.http.get(base(url));

        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string): Observable < any > => this.http.get(base(url));
        this.formData = generateFormData;
    }

    stations = {
        // @GetMapping("/stations")
        // public StationData.StationsResult init(@PageableDefault(size = 5) Pageable pageable) {
        //     return stationTopLevelService.getStations(pageable);
        // }
        get: (page: string | number): Observable < any > =>
            this.GET(`/stations?page=${page}`)
    };

    station = {
        // @GetMapping(value = "/station/{id}")
        // public StationData.StationResult getStation(@PathVariable Long id) {
        //     return stationTopLevelService.getStation(id);
        // }
        get: (id: string | number): Observable < any > =>
            this.GET(`/station/${id}`),

        // @PostMapping("/station-form-commit")
        // public StationData.StationResult formCommit(@RequestBody Station station) {
        //     return stationTopLevelService.saveStation(station);
        // }
        form: (station: Station): Observable < any > =>
            this.POST(`/station-form-commit/`, station),

        // @PostMapping("/station-delete-commit")
        // public OperationStatusRest deleteStationCommit(Long id) {
        //     return stationTopLevelService.deleteStationById(id);
        // }
        delete: (id: string | number): Observable < any > =>
            this.POST(`/station-delete-commit`, this.formData({ id }))
    };
}
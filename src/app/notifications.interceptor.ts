import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DefaultResponse } from './models/DefaultResponse';
import { OperationStatus } from './enums/OperationStatus';

@Injectable()

export class NotificationsInterceptor implements HttpInterceptor {

    options = {
        timeOut: 10000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
    };

    constructor(
        private notificationsService: NotificationsService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    event = event.clone({
                        body: this.modifyBody(event.body)
                    });
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status >= 400) {
                    if (error.error) {
                        this.notificationsService.error(error.error.status, error.error.message, {
                            // timeOut: 10000,
                            // showProgressBar: true,
                            pauseOnHover: true,
                            clickToClose: true,
                        });
                    }
                }
                return EMPTY;
                // return throwError(error);
            })
        );
    }

    private modifyBody(response: DefaultResponse): void {
        const status: OperationStatus = response.status;
        const errors: string[] = response.errorMessages || [];
        const infos: string[] = response.infoMessages || [];

        errors.forEach((err: string) => {
            this.notificationsService.error(status, err, {
                // timeOut: 10000,
                // showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true,
            });
        });

        infos.forEach((info: string) => {
            if (status === OperationStatus.OK) {
                this.notificationsService.success(status, info, {
                    timeOut: 10000,
                    showProgressBar: true,
                    pauseOnHover: true,
                    clickToClose: true,
                });
            } else {
                this.notificationsService.info(status, info, {
                    // timeOut: 10000,
                    // showProgressBar: true,
                    pauseOnHover: true,
                    clickToClose: true,
                });
            }
        });

        if (errors.length === 0 && infos.length === 0 && status) {
            this.notificationsService.success(status, null, {
                timeOut: 10000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true,
            });
        }
    }
}
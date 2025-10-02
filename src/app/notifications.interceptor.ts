import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DefaultResponse } from './models/DefaultResponse';
import { OperationStatus } from './enums/OperationStatus';
import { ToastrService } from 'ngx-toastr';
import {RuntimeService} from '@services/runtime/runtime.service';

@Injectable()
export class NotificationsInterceptor implements HttpInterceptor {
      private runtimeService = inject(RuntimeService);
      private toastr = inject(ToastrService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let serverReady = this.runtimeService.isServerReady();
        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                //this.notificationsService.setServerReady(req.url);
                if (event instanceof HttpResponse) {
                    event = event.clone({
                        body: this.modifyBody(event.body)
                    });
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status >= 400) {
                    //this.notificationsService.setServerReady(req.url);
                    if (error.error) {
                        const title: string = error.error.status ? error.error.status : error.status;
                        const content: string = error.error.message ? error.error.message : error.message;
                        this.toastr.error(content, title, {
                            timeOut: 10000,
                            progressBar: true,
                            enableHtml: true
                        });
                    }
                }
                if (error.status === 0) {
                    console.log("Server is ready: ", serverReady, ", ulr: ",  req.url);
                    if (serverReady) {
                        const title: string = 'Server offline';
                        const content: string = '';
                        this.toastr.error(content, title, {
                            timeOut: 10000,
                            progressBar: true,
                            enableHtml: true
                        });
                    }
                    else {
                        console.log("Server isn't ready yet. ulr: ", req.url);
                    }
                }
                return throwError(error);
            })
        );
    }

    private modifyBody(response: DefaultResponse): void {
        const status: OperationStatus = response.status;
        const errors: string[] = response.errorMessages || [];
        const infos: string[] = response.infoMessages || [];

        errors.forEach((err: string) => {
            this.toastr.error(err, status, {
                timeOut: 10000,
                progressBar: true,
                enableHtml: true
            });
        });

        infos.forEach((info: string) => {
            if (status === OperationStatus.OK) {
                this.toastr.success(info, status, {
                    timeOut: 10000,
                    progressBar: true,
                    enableHtml: true
                });
            } else {
                this.toastr.info(info, status, {
                    timeOut: 10000,
                    progressBar: true,
                    enableHtml: true
                });
            }
        });

        if (errors.length === 0 && infos.length === 0 && status) {
            this.toastr.success('', status, {
                timeOut: 10000,
                progressBar: true,
                enableHtml: true
            });
        }
    }
}
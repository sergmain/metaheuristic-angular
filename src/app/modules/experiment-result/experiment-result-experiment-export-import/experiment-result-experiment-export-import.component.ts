import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { ExperimentResultService } from '@src/app/services/experiment-result/experiment-result.service';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'experiment-result-experiment-export-import',
    templateUrl: './experiment-result-experiment-export-import.component.html',
    styleUrls: ['./experiment-result-experiment-export-import.component.scss']
})
export class ExperimentResultExperimentExportImportComponent {
    readonly states = LoadStates;
    currentStates: Set<LoadStates> = new Set();
    atlasDownloadName: string;

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private experimentResultService: ExperimentResultService
    ) {
        this.atlasDownloadName = `atlas-${this.route.snapshot.paramMap.get('atlasId')}.yaml`;
    }

    back(): void {
        this.router.navigate(['/ai', 'atlas', 'experiments']);
    }

    upload(): void {
        this.experimentResultService
            .uploadFromFile(this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe(
                (res: any) => {
                    if (res.status.toLowerCase() === 'ok') {
                        this.back();
                    }
                }
            );
    }
}
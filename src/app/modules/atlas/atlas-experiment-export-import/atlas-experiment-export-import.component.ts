import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { AtlasService } from '@src/app/services/atlas';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'atlas-experiment-export-import',
    templateUrl: './atlas-experiment-export-import.component.html',
    styleUrls: ['./atlas-experiment-export-import.component.scss']
})
export class AtlasExperimentExportImportComponent {
    readonly states = LoadStates;
    currentStates: Set<string> = new Set();
    atlasDownloadName: string;

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private atlasService: AtlasService
    ) {
        this.atlasDownloadName = `atlas-${this.route.snapshot.paramMap.get('atlasId')}.yaml`;
    }

    back(): void {
        this.router.navigate(['/dispatcher', 'atlas', 'experiments']);
    }

    upload(): void {
        this.atlasService.experiment
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
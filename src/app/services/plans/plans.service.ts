import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PlansService {
    POST: any;
    GET: any;
    formData: any;

    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/plan${url}`;

        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string): Observable < any > => this.http.get(base(url));
        this.formData = generateFormData;
    }

    plans = {
        // @GetMapping("/plans")
        // @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DATA')")
        // public PlanApiData.PlansResult plans(@PageableDefault(size = 5) Pageable pageable) {
        //     return planTopLevelService.getPlans(pageable, false);
        // }
        get: (page: string | number): Observable < any > =>
            this.GET(`/plans?page=${page}`),

        // @GetMapping("/plans-archived-only")
        // @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DATA')")
        // public PlanApiData.PlansResult plansArchivedOnly(@PageableDefault(size = 5) Pageable pageable) {
        //     return planTopLevelService.getPlans(pageable, true);
        // }
        getArchivedOnly: (page: string | number): Observable < any > =>
            this.GET(`/plans-archived-only?page=${page}`)

    };

    plan = {
        // @GetMapping(value = "/plan/{id}")
        // @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DATA')")
        // public PlanApiData.PlanResult edit(@PathVariable Long id) {
        //     return planTopLevelService.getPlan(id);
        // }
        get: (id: string | number): Observable < any > =>
            this.GET(`/plan/${id}`),

        // @GetMapping(value = "/plan-validate/{id}")
        // @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DATA')")
        // public PlanApiData.PlanResult validate(@PathVariable Long id) {
        //     return planTopLevelService.validatePlan(id);
        // }
        validate: (id: string | number): Observable < any > =>
            this.GET(`/plan-validate/${id}`),

        // @PostMapping("/plan-add-commit")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public PlanApiData.PlanResult addFormCommit(@RequestParam(name = "planYaml") String planYamlAsStr) {
        //     return planTopLevelService.addPlan(planYamlAsStr);
        // }
        add: (planYaml: string): Observable < any > =>
            this.POST(`/plan-add-commit`, this.formData({ planYaml })),

        // @PostMapping("/plan-edit-commit")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public PlanApiData.PlanResult editFormCommit(Long planId, @RequestParam(name = "planYaml") String planYamlAsStr) {
        //     return planTopLevelService.updatePlan(planId, planYamlAsStr);
        // }
        edit: (planId: number, planYaml: string): Observable < any > =>
            this.POST(`/plan-edit-commit/`, this.formData({ planId, planYaml })),

        // @PostMapping("/plan-delete-commit")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public OperationStatusRest deleteCommit(Long id) {
        //     return planTopLevelService.deletePlanById(id);
        // }
        delete: (id: string | number): Observable < any > =>
            this.POST(`/plan-delete-commit?`, this.formData({ id })),

        // @PostMapping("/plan-archive-commit")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public OperationStatusRest archiveCommit(Long id) {
        //     return planTopLevelService.archivePlanById(id);
        // }
        archive: (id: string | number): Observable < any > =>
            this.POST(`/plan-archive-commit`, this.formData({ id })),

        // @PostMapping(value = "/plan-upload-from-file")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public OperationStatusRest uploadPlan(final MultipartFile file) {
        //     return planTopLevelService.uploadPlan(file);
        // }
        uploadFromFile: (file: any): Observable < any > =>
            this.POST(`/plan-upload-from-file`, this.formData({ file }))

    };

    workbooks = {
        // @GetMapping("/workbooks/{id}")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA', 'MANAGER')")
        // public PlanApiData.WorkbooksResult workbooks(@PathVariable Long id, @PageableDefault(size = 5) Pageable pageable) {
        //     return workbookTopLevelService.getWorkbooksOrderByCreatedOnDesc(id, pageable);
        // }
        get: (planId: string | number, page: number | string): Observable < any > =>
            this.GET(`/workbooks/${planId}?page=${page}`),
    };

    workbook = {
        // @PostMapping("/plan-code-workbook-add-commit")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public SimpleWorkbookAddingResult workbookAddCommit(String planCode, String poolCode, String inputResourceParams) {
        //     PlanApiData.WorkbookResult workbookResult = planTopLevelService.addWorkbook(planCode, poolCode, inputResourceParams);
        //     return new SimpleWorkbookAddingResult(workbookResult.workbook.getId());
        // }
        planCodeWorkbookAddCommit: (planCode: string, poolCode: string, inputResourceParams: string): Observable < any > =>
            this.POST(`/plan-code-workbook-add-commit`, this.formData({ planCode, poolCode, inputResourceParams })),

        // @PostMapping("/workbook-add-commit")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public PlanApiData.WorkbookResult workbookAddCommit(Long planId, String poolCode, String inputResourceParams) {
        //     //noinspection UnnecessaryLocalVariable
        //     PlanApiData.WorkbookResult workbookResult = planTopLevelService.addWorkbook(planId, poolCode, inputResourceParams);
        //     return workbookResult;
        // }
        addCommit: (planId: string | number, poolCode: string, inputResourceParams: string): Observable < any > =>
            this.POST(`/workbook-add-commit/`, this.formData({ planId, poolCode, inputResourceParams })),

        // @PostMapping("/workbook-create")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public PlanApiData.TaskProducingResult createWorkbook(Long planId, String inputResourceParam) {
        //     return workbookTopLevelService.createWorkbook(planId, inputResourceParam);
        // }
        create: (planId: string | number, inputResourceParam: string): Observable < any > =>
            this.POST(`/workbook-create`, this.formData({ planId, inputResourceParam })),

        // @GetMapping(value = "/workbook/{planId}/{workbookId}")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public PlanApiData.WorkbookResult workbookEdit(@SuppressWarnings("unused") @PathVariable Long planId, @PathVariable Long workbookId) {
        //     return workbookTopLevelService.getWorkbookExtended(workbookId);
        // }
        get: (planId: string | number, workbookId: string | number): Observable < any > =>
            this.GET(`/workbook/${planId}/${workbookId}`),

        // @SuppressWarnings("unused")
        // @PostMapping("/workbook-delete-commit")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public OperationStatusRest workbookDeleteCommit(Long planId, Long workbookId) {
        //     return planTopLevelService.deleteWorkbookById(workbookId);
        // }
        deleteCommit: (planId: string | number, workbookId: string | number): Observable < any > =>
            this.POST(`/workbook-delete-commit/`, this.formData({ planId, workbookId })),

        // @GetMapping("/workbook-target-exec-state/{planId}/{state}/{id}")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public OperationStatusRest workbookTargetExecState(@SuppressWarnings("unused") @PathVariable Long planId, @PathVariable String state, @PathVariable Long id) {
        //     return planTopLevelService.changeWorkbookExecState(state, id);
        // }
        targetExecState: (planId: string | number, state: string, id: string | number): Observable < any > =>
            this.GET(`/workbook-target-exec-state/${planId}/${state}/${id}`),
    };
}
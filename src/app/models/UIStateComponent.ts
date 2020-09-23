export class UIStateComponent {

    isLoading: boolean = false;

    setIsLoadingStart(): void {
        this.isLoading = true;
    }

    setIsLoadingEnd(): void {
        this.isLoading = false;
    }

}
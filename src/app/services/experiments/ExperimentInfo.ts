import { ExecContext } from "../source-codes/ExecContext";
import { Features } from "./Features";

export interface ExperimentInfo {
    allDatasetOptions?: (null)[] | null;
    features?: Features[] | null;
    workbook: ExecContext;
    workbookExecState: string;
}
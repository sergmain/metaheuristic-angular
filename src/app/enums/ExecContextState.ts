export enum ExecContextState {
    ERROR = 'ERROR',          // some error in configuration
    UNKNOWN = 'UNKNOWN',        // unknown state
    NONE = 'NONE',            // just created execContext
    PRODUCING = 'PRODUCING',       // producing was just started
    PRODUCED = 'PRODUCED',        // producing was finished
    STARTED = 'STARTED',         // started
    STOPPED = 'STOPPED',         // stopped
    FINISHED = 'FINISHED',        // finished
    DOESNT_EXIST = 'DOESNT_EXIST',    // doesn't exist. this state is needed at processor side to reconcile list of tasks
    EXPORTING_TO_ATLAS = 'EXPORTING_TO_ATLAS',    // execContext is marked as needed to be exported to atlas
    EXPORTING_TO_ATLAS_WAS_STARTED = 'EXPORTING_TO_ATLAS_WAS_STARTED',    // execContext is marked as needed to be exported to atlas and export was started
    EXPORTED_TO_ATLAS = 'EXPORTED_TO_ATLAS'   // execContext was exported to atlas
}
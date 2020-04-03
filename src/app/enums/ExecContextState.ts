export enum ExecContextState {
    ERROR,          // some error in configuration
    UNKNOWN,        // unknown state
    NONE,            // just created execContext
    PRODUCING,       // producing was just started
    PRODUCED,        // producing was finished
    STARTED,         // started
    STOPPED,         // stopped
    FINISHED,        // finished
    DOESNT_EXIST,    // doesn't exist. this state is needed at processor side to reconcile list of tasks
    EXPORTING_TO_ATLAS,    // execContext is marked as needed to be exported to atlas
    EXPORTING_TO_ATLAS_WAS_STARTED,    // execContext is marked as needed to be exported to atlas and export was started
    EXPORTED_TO_ATLAS    // execContext was exported to atlas
}
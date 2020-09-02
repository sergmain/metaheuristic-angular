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
}
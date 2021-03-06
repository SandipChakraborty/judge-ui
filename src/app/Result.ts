export interface Result {
    stdout: string;
    time: string;
    memory: string;
    stderr: string;
    token: string;
    compile_output: string;
    message: string;
    status: Status
}

export interface Status {
    id: number;
    description: string;
}
export class SourceCode {
    source_code: String = '';
    stdin: String = '';
    expected_output: String = '';
    language_id: number = 0;

    constructor(source_code: String, stdin: String, expected_output: String, language_id: number) {
        this.source_code = source_code;
        this.stdin = stdin;
        this.expected_output = expected_output;
        this.language_id = language_id;
    }
}
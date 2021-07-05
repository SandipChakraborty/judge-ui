import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JudgeService } from './judge.service';
import { SourceCode } from './SourceCode';
import { Result } from './Result';
import { LoadingService } from './loading.service';
import { Language } from './Language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  indexValue: number = 0;
  showStdout: boolean = false;

  // Final Values.
  sourceCodeConverted: string = '';
  stdInArr: Array<string> = [];
  stdOutArr: Array<string> = [];

  showLanguages: boolean = false;
  languages: Array<Language> = [];

  // Default values for test.
  codeB = 'aW1wb3J0IGphdmEuaW8uQnl0ZUFycmF5SW5wdXRTdHJlYW07CmltcG9ydCBqYXZhLmlvLklPRXhjZXB0aW9uOwppbXBvcnQgamF2YS5pby5JbnB1dFN0cmVhbTsKaW1wb3J0IGphdmEuaW8uUHJpbnRXcml0ZXI7CmltcG9ydCBqYXZhLnV0aWwuQXJyYXlzOwppbXBvcnQgamF2YS51dGlsLklucHV0TWlzbWF0Y2hFeGNlcHRpb247CgpwdWJsaWMgY2xhc3MgTWFpbiB7CglJbnB1dFN0cmVhbSBpczsKCVByaW50V3JpdGVyIG91dDsKCVN0cmluZyBJTlBVVCA9ICIiOwoJCgl2b2lkIHNvbHZlKCkKCXsKCQlpbnRbXSBhID0gbmEoMyk7CgkJaW50W10gYiA9IG5hKDMpOwoJCWludCBhcCA9IDAsIGJwID0gMDsKCQlmb3IoaW50IGkgPSAwO2kgPCAzO2krKyl7CgkJCWlmKGFbaV0gPiBiW2ldKXsKCQkJCWFwKys7CgkJCX1lbHNlIGlmKGFbaV0gPCBiW2ldKXsKCQkJCWJwKys7CgkJCX0KCQl9CgkJb3V0LnByaW50bG4oYXAgKyAiICIgKyBicCk7Cgl9CgkKCXZvaWQgcnVuKCkgdGhyb3dzIEV4Y2VwdGlvbgoJewoJCWlzID0gSU5QVVQuaXNFbXB0eSgpID8gU3lzdGVtLmluIDogbmV3IEJ5dGVBcnJheUlucHV0U3RyZWFtKElOUFVULmdldEJ5dGVzKCkpOwoJCW91dCA9IG5ldyBQcmludFdyaXRlcihTeXN0ZW0ub3V0KTsKCQkKCQlsb25nIHMgPSBTeXN0ZW0uY3VycmVudFRpbWVNaWxsaXMoKTsKCQlzb2x2ZSgpOwoJCW91dC5mbHVzaCgpOwoJCWlmKCFJTlBVVC5pc0VtcHR5KCkpdHIoU3lzdGVtLmN1cnJlbnRUaW1lTWlsbGlzKCktcysibXMiKTsKCX0KCQoJcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgdGhyb3dzIEV4Y2VwdGlvbiB7IG5ldyBNYWluKCkucnVuKCk7IH0KCQoJcHJpdmF0ZSBieXRlW10gaW5idWYgPSBuZXcgYnl0ZVsxMDI0XTsKCXByaXZhdGUgaW50IGxlbmJ1ZiA9IDAsIHB0cmJ1ZiA9IDA7CgkKCXByaXZhdGUgaW50IHJlYWRCeXRlKCkKCXsKCQlpZihsZW5idWYgPT0gLTEpdGhyb3cgbmV3IElucHV0TWlzbWF0Y2hFeGNlcHRpb24oKTsKCQlpZihwdHJidWYgPj0gbGVuYnVmKXsKCQkJcHRyYnVmID0gMDsKCQkJdHJ5IHsgbGVuYnVmID0gaXMucmVhZChpbmJ1Zik7IH0gY2F0Y2ggKElPRXhjZXB0aW9uIGUpIHsgdGhyb3cgbmV3IElucHV0TWlzbWF0Y2hFeGNlcHRpb24oKTsgfQoJCQlpZihsZW5idWYgPD0gMClyZXR1cm4gLTE7CgkJfQoJCXJldHVybiBpbmJ1ZltwdHJidWYrK107Cgl9CgkKCXByaXZhdGUgYm9vbGVhbiBpc1NwYWNlQ2hhcihpbnQgYykgeyByZXR1cm4gIShjID49IDMzICYmIGMgPD0gMTI2KTsgfQoJcHJpdmF0ZSBpbnQgc2tpcCgpIHsgaW50IGI7IHdoaWxlKChiID0gcmVhZEJ5dGUoKSkgIT0gLTEgJiYgaXNTcGFjZUNoYXIoYikpOyByZXR1cm4gYjsgfQoJCglwcml2YXRlIGRvdWJsZSBuZCgpIHsgcmV0dXJuIERvdWJsZS5wYXJzZURvdWJsZShucygpKTsgfQoJcHJpdmF0ZSBjaGFyIG5jKCkgeyByZXR1cm4gKGNoYXIpc2tpcCgpOyB9CgkKCXByaXZhdGUgU3RyaW5nIG5zKCkKCXsKCQlpbnQgYiA9IHNraXAoKTsKCQlTdHJpbmdCdWlsZGVyIHNiID0gbmV3IFN0cmluZ0J1aWxkZXIoKTsKCQl3aGlsZSghKGlzU3BhY2VDaGFyKGIpKSl7IC8vIHdoZW4gbmV4dExpbmUsIChpc1NwYWNlQ2hhcihiKSAmJiBiICE9ICcgJykKCQkJc2IuYXBwZW5kQ29kZVBvaW50KGIpOwoJCQliID0gcmVhZEJ5dGUoKTsKCQl9CgkJcmV0dXJuIHNiLnRvU3RyaW5nKCk7Cgl9CgkKCXByaXZhdGUgY2hhcltdIG5zKGludCBuKQoJewoJCWNoYXJbXSBidWYgPSBuZXcgY2hhcltuXTsKCQlpbnQgYiA9IHNraXAoKSwgcCA9IDA7CgkJd2hpbGUocCA8IG4gJiYgIShpc1NwYWNlQ2hhcihiKSkpewoJCQlidWZbcCsrXSA9IChjaGFyKWI7CgkJCWIgPSByZWFkQnl0ZSgpOwoJCX0KCQlyZXR1cm4gbiA9PSBwID8gYnVmIDogQXJyYXlzLmNvcHlPZihidWYsIHApOwoJfQoJCglwcml2YXRlIGNoYXJbXVtdIG5tKGludCBuLCBpbnQgbSkKCXsKCQljaGFyW11bXSBtYXAgPSBuZXcgY2hhcltuXVtdOwoJCWZvcihpbnQgaSA9IDA7aSA8IG47aSsrKW1hcFtpXSA9IG5zKG0pOwoJCXJldHVybiBtYXA7Cgl9CgkKCXByaXZhdGUgaW50W10gbmEoaW50IG4pCgl7CgkJaW50W10gYSA9IG5ldyBpbnRbbl07CgkJZm9yKGludCBpID0gMDtpIDwgbjtpKyspYVtpXSA9IG5pKCk7CgkJcmV0dXJuIGE7Cgl9CgkKCXByaXZhdGUgaW50IG5pKCkKCXsKCQlpbnQgbnVtID0gMCwgYjsKCQlib29sZWFuIG1pbnVzID0gZmFsc2U7CgkJd2hpbGUoKGIgPSByZWFkQnl0ZSgpKSAhPSAtMSAmJiAhKChiID49ICcwJyAmJiBiIDw9ICc5JykgfHwgYiA9PSAnLScpKTsKCQlpZihiID09ICctJyl7CgkJCW1pbnVzID0gdHJ1ZTsKCQkJYiA9IHJlYWRCeXRlKCk7CgkJfQoJCQoJCXdoaWxlKHRydWUpewoJCQlpZihiID49ICcwJyAmJiBiIDw9ICc5Jyl7CgkJCQludW0gPSBudW0gKiAxMCArIChiIC0gJzAnKTsKCQkJfWVsc2V7CgkJCQlyZXR1cm4gbWludXMgPyAtbnVtIDogbnVtOwoJCQl9CgkJCWIgPSByZWFkQnl0ZSgpOwoJCX0KCX0KCQoJcHJpdmF0ZSBsb25nIG5sKCkKCXsKCQlsb25nIG51bSA9IDA7CgkJaW50IGI7CgkJYm9vbGVhbiBtaW51cyA9IGZhbHNlOwoJCXdoaWxlKChiID0gcmVhZEJ5dGUoKSkgIT0gLTEgJiYgISgoYiA+PSAnMCcgJiYgYiA8PSAnOScpIHx8IGIgPT0gJy0nKSk7CgkJaWYoYiA9PSAnLScpewoJCQltaW51cyA9IHRydWU7CgkJCWIgPSByZWFkQnl0ZSgpOwoJCX0KCQkKCQl3aGlsZSh0cnVlKXsKCQkJaWYoYiA+PSAnMCcgJiYgYiA8PSAnOScpewoJCQkJbnVtID0gbnVtICogMTAgKyAoYiAtICcwJyk7CgkJCX1lbHNlewoJCQkJcmV0dXJuIG1pbnVzID8gLW51bSA6IG51bTsKCQkJfQoJCQliID0gcmVhZEJ5dGUoKTsKCQl9Cgl9CgkKCXByaXZhdGUgc3RhdGljIHZvaWQgdHIoT2JqZWN0Li4uIG8pIHsgU3lzdGVtLm91dC5wcmludGxuKEFycmF5cy5kZWVwVG9TdHJpbmcobykpOyB9Cn0K';
  langIdNum = 62;
  //


  finalOut: Result[] = [];

  constructor(private formBuilder: FormBuilder,
    private judge: JudgeService,
    public loader: LoadingService) {

  }
  ngOnInit(): void {
    this.loader.hide();
  }


  form: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]], // Remove defaults later
    langId: [this.langIdNum, [Validators.required]], // Remove defaults later
    other: this.formBuilder.array([this.addOtherFormGroupDefault()]) // Remove defaults later
  });


  addSkillButtonClick(): void {

    (<FormArray>this.form.get('other')).push(this.addOtherFormGroup());
  }


  addOtherFormGroup() {
    return this.formBuilder.group({
      stdin: ['', Validators.required],
      stdout: ['', Validators.required],
    });
  }

  addOtherFormGroupDefault() {
    return this.formBuilder.group({
      stdin: ['', Validators.required],
      stdout: ['', Validators.required],
    });
  }

  onSubmit() {
    this.showStdout = false;
    this.finalOut = [];
    const formArray: FormArray = this.form.get('other') as FormArray;

    const source_code = this.sourceCodeConverted;
    const language_id = this.form.get('langId')?.value;



    for (let i in formArray.controls) {

      const stdin = this.stdInArr[i];
      const expected_output = this.stdOutArr[i];

      if (stdin && expected_output) {

        const sc = new SourceCode(source_code, stdin, expected_output, language_id);

        this.judge.postCode(sc).subscribe((res: any) => {
          const token = res['token'] as string;
          setTimeout(() => {
            this.judge.checkCodeStatus(token).subscribe((data: Result) => {
              data.stdout = atob(data.stdout);
              data.stdin = atob(stdin);
              data.expectedOut = atob(expected_output);
              this.finalOut.push(data);
              this.loader.hide();
            }, err => {
              console.error(err);
              this.loader.hide();
            });
          }, 5000);
        }, err => {
          console.error(err);
          this.loader.hide();
        });
      }

    }
  }

  getControls() {
    return (this.form.get('other') as FormArray).controls;
  }


  reset() {
    this.form.reset();
    this.finalOut = [];
    this.languages = [];
  }
  reload() {
    window.location.reload();
  }

  getAllLanguages() {

    this.judge.getAllLanguages().subscribe(
      data => {
        this.languages = data;
      }, err => {
        this.languages = [];
        console.error(err);
      }
    );
  }


  onFileChange(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const str: string[] | undefined = reader.result?.toString().split('base64,');
        this.sourceCodeConverted = str ? str[1] : '';
      };
    }
  }


  onInputChange(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const str: string[] | undefined = reader.result?.toString().split('base64,');
        this.stdInArr[this.indexValue] = str ? str[1] : '';
      };
    }
  }

  onOutputChange(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const str: string[] | undefined = reader.result?.toString().split('base64,');
        this.stdOutArr[this.indexValue] = str ? str[1] : '';
      };
    }
  }
}

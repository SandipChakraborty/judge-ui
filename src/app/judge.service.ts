import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SourceCode } from './SourceCode';
import { Observable } from 'rxjs';
import { Result } from './Result';
import { Language } from './Language';

@Injectable({
  providedIn: 'root'
})
export class JudgeService {

  PORT:number = 2358;
  BASE_URI = `http://localhost:${this.PORT}`;

  constructor(private http: HttpClient) { }

  postCode(sourceCode: SourceCode): Observable<any> {
    const uri = `${this.BASE_URI}/submissions/?base64_encoded=true`;
    console.log(JSON.stringify(sourceCode));
    return this.http.post(uri, sourceCode);
  }

  checkCodeStatus(token: string): Observable<Result> {
    const uri = `${this.BASE_URI}/submissions/${token}?base64_encoded=true`;
    return this.http.get<Result>(uri);
  }

  getAllLanguages() : Observable<Array<Language>> {
    const uri = `${this.BASE_URI}/languages/all`;
    return this.http.get<Array<Language>>(uri);
  }
}

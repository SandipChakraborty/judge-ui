import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SourceCode } from './SourceCode';
import { Observable } from 'rxjs';
import { Result } from './Result';

@Injectable({
  providedIn: 'root'
})
export class JudgeService {

  PORT:number = 2358;

  constructor(private http: HttpClient) { }

  postCode(sourceCode: SourceCode): Observable<any> {
    const uri = `http://localhost:${this.PORT}/submissions/?base64_encoded=true`;
    return this.http.post(uri, sourceCode);
  }

  checkCodeStatus(token: string): Observable<Result> {
    const uri = `http://localhost:${this.PORT}/submissions/${token}?base64_encoded=true`;
    return this.http.get<Result>(uri);
  }
}

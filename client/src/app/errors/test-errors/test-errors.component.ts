import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {

  baseUrl = 'https://localhost:5001/api/';

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(){
    this.httpClient.get(this.baseUrl + 'buggy/not-found').subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }
  get500Error(){
    this.httpClient.get(this.baseUrl + 'buggy/server-error').subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }
  get400Error(){
    this.httpClient.get(this.baseUrl + 'buggy/bad-request').subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }
  get401Error(){
    this.httpClient.get(this.baseUrl + 'buggy/auth').subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }

  get400InvalidFormRequestError(){
    this.httpClient.post(this.baseUrl + 'account/register', {}).subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }
}

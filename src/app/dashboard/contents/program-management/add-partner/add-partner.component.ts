import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AddNewPartnerReq, AddNewPartnerRes } from 'src/app/models/models';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})


export class AddPartnerComponent implements OnInit {
  partnerForm:FormGroup;
  AddNewPartnerReq : AddNewPartnerReq;
  _whiteList : false
  _blackList : false
  isLoadingResults = false;
  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };


  constructor(
    private apiService: ApiService,
    private formBuilder : FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    
    // public data :AddNewPartnerReq
  ) { }
  
 
  ngOnInit() {
    this.partnerForm = this.formBuilder.group({
      _namaPerusahaan: ['', Validators.required],
      _alamatPerusahaan: ['', Validators.required],
      _alamatDomisili: ['', Validators.required],
      _userType:['',Validators.required],
      _noTelp: ['', Validators.required],
      _jenisUsaha: ['',Validators.required],
      _taxNumber: ['',Validators.required],
      _picName: ['', Validators.required],
      _picPhone: ['', Validators.required],
      _picEmail: ['', Validators.required],
      // _fileUpload:['', Validators.required]
    })
  }

  saveForm() {
    event.preventDefault();
    if (this.partnerForm.invalid) {
      return;
    }
    this.isLoadingResults = true;

    this.AddNewPartnerReq = {
      namaPerusahaan : this.partnerForm.value._namaPerusahaan,
      phoneNumber : this.partnerForm.value._noTelp,
      alamatPerusahaan : this.partnerForm.value._alamatPerusahaan,
      alamatDomisili : this.partnerForm.value._alamatDomisili,
      jenisUsaha : this.partnerForm.value._jenisUsaha,
      taxNumber : this.partnerForm.value._taxNumber,
      typeUser : this.partnerForm.value._userType,
      picNama : this.partnerForm.value._picName,
      picEmail : this.partnerForm.value._picEmail,
      picPhone : this.partnerForm.value._picPhone,
      status : "draft"
    };

    console.log('query : \n', this.AddNewPartnerReq);
    this.apiService.APIAddNewPartner(
      this.AddNewPartnerReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewPartnerRes) => {
      if (res.data !== null) {
        this.snackBar.open('Success Save Data', 'close', this.matSnackBarConfig);        
        this.router.navigate(['/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Save data', 'close', this.matSnackBarConfig);
      this.router.navigate(['/program-management/data-partner']);
      return;
    });
  }

  cancelForm(){
    this.snackBar.open('Cancel create data', 'close', this.matSnackBarConfig);
    this.router.navigate(['/program-management/data-partner']);
  }

  submitForm(){
    event.preventDefault();
    if (this.partnerForm.invalid) {
      return;
    }
    this.isLoadingResults = true;

    this.AddNewPartnerReq = {
      namaPerusahaan : this.partnerForm.value._namaPerusahaan,
      phoneNumber : this.partnerForm.value._noTelp,
      alamatPerusahaan : this.partnerForm.value._alamatPerusahaan,
      alamatDomisili : this.partnerForm.value._alamatDomisili,
      jenisUsaha : this.partnerForm.value._jenisUsaha,
      taxNumber : this.partnerForm.value._taxNumber,
      typeUser : this.partnerForm.value._userType,
      picNama : this.partnerForm.value._picName,
      picEmail : this.partnerForm.value._picEmail,
      picPhone : this.partnerForm.value._picPhone,
      status : "waiting for approval"
    };

    console.log('query : \n', this.AddNewPartnerReq);
    this.apiService.APIAddNewPartner(
      this.AddNewPartnerReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewPartnerRes) => {
      if (res.data !== null) {
        this.snackBar.open('Success Submit Data', 'close', this.matSnackBarConfig);        
        this.router.navigate(['/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Submit data', 'close', this.matSnackBarConfig);
      this.router.navigate(['/program-management/data-partner']);
      return;
    });
  }
}
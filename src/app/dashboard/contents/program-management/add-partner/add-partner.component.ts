import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})


export class AddPartnerComponent implements OnInit {
  partnerForm:FormGroup;
  _checked = false;
  isLoadingResults = false;
  constructor(
    private apiService: ApiService,
    private formBuilder : FormBuilder
  ) { }
  
 
  ngOnInit() {
    this.partnerForm = this.formBuilder.group({
      _namaPerusahaan: ['', Validators.required],
      _alamatPerusahaan: ['', Validators.required],
      _alamatDomisili: ['', Validators.required],
      _noTelp: ['', Validators.required],
      _jenisUsaha: ['', Validators.required],
      _taxNumber: ['', Validators.required],
      _whiteList: [''],
      _blackList: [''],
      _picName: [''],
      _picPhone: [''],
      _picEmail: [''],
      _store: [''],
    })
  }

  saveForm() {
    if (this.partnerForm.invalid) {
      return;
    }
    this.isLoadingResults = true;
    console.log(this.partnerForm.value._alamatPerusahaan)
    // this.apiService.APIGetSKU
    // this.apiService.API
  }


}
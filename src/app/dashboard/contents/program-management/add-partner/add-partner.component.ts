import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AddNewPartnerReq, AddNewStoreReq, AddNewPartnerRes, AddNewStoreResp } from 'src/app/models/models';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { AddNewStoreComponent } from '../add-new-store/add-new-store.component'
import { element } from 'protractor';
import { getElement } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})

export class AddPartnerComponent implements OnInit {
  data_store : AddNewStoreReq;
  partnerForm:FormGroup;
  dataForm:FormGroup;
  AddNewPartnerReq : AddNewPartnerReq;
  AddNewStoreReq : AddNewStoreReq[];
  arrStore : AddNewStoreReq[] = [];
  _whiteList : false
  _blackList : false
  isLoadingResults = false;
  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };
  myFiles:string [] = [];


  constructor(
    private apiService: ApiService,
    private formBuilder : FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    
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
      _fileUpload:[''],
      _store: ['', ''],
      // _fileUpload:['', Validators.required]
    })
    // this.partnerForm = this.formBuilder.group({
    //   _namaPerusahaan: ['', ''],
    //   _alamatPerusahaan: ['',''],
    //   _alamatDomisili: ['', ''],
    //   _userType:['',''],
    //   _noTelp: ['', ''],
    //   _jenisUsaha: ['',''],
    //   _taxNumber: ['',''],
    //   _picName: ['', ''],
    //   _picPhone: ['', ''],
    //   _picEmail: ['', ''],
    //   _fileUpload:[''],
    //   _store: ['', ''],
    //   // _fileUpload:['', Validators.required]
    // })
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

    console.log('AddNewPartnerReq : \n', this.AddNewPartnerReq);
    this.apiService.APIAddNewPartner(
      this.AddNewPartnerReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewPartnerRes) => {
      if (res.data !== null) {
        // this.UploadFile()
        this.saveStore(res.data["ID"])
        this.snackBar.open('Success Save Data', 'close', this.matSnackBarConfig);        
        this.router.navigate(['/dashboard/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Save data', 'close', this.matSnackBarConfig);
      this.router.navigate(['/dashboard/program-management/data-partner']);
      return;
    });
    
  }

  cancelForm(){
    this.snackBar.open('Cancel create data', 'close', this.matSnackBarConfig);
    this.router.navigate(['/dashboard/program-management/data-partner']);
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

    console.log('AddNewPartnerReq : \n', this.AddNewPartnerReq);
    this.apiService.APIAddNewPartner(
      this.AddNewPartnerReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewPartnerRes) => {
      if (res.data !== null) {
        // this.UploadFile()
        this.saveStore(res.data["ID"])
        this.snackBar.open('Success Submit Data', 'close', this.matSnackBarConfig);        
        this.router.navigate(['/dashboard/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Submit data', 'close', this.matSnackBarConfig);
      this.router.navigate(['/dashboard/program-management/data-partner']);
      return;
    });

  }

  saveStore(id) {
    // console.log('AddNewStoreReq : \n', this.AddNewStoreReq);
    if (this.arrStore.length > 0) {
      for (var i = 0;i<this.arrStore.length;i++){
        this.arrStore[i].m_institution_id = id    
        this.apiService.APIAddNewStore(
          this.arrStore[i],
          window.localStorage.getItem('token')
        ).subscribe((res: AddNewStoreResp) => {
          if (res.data !== null) {
            // this.snackBar.open('Success Submit Data', 'close', this.matSnackBarConfig);        
            // this.router.navigate(['/dashboard/program-management/data-partner']);
            return;
          }
          // this.isLoadingResults = false;
          this.snackBar.open('Failed Submit data', 'close', this.matSnackBarConfig);
          // this.router.navigate(['/dashboard/program-management/data-partner']);
          return;
        });
      }
      }
  }

  UploadFile(){
    const formData = new FormData();
 
    for (var i = 0; i < this.myFiles.length; i++) { 
      formData.append("file[]", this.myFiles[i]);
    }
    // this.http.post('http://localhost:8001/upload.php', formData)
    //   .subscribe(res => {
    //     console.log(res);
    //     alert('Uploaded Successfully.');
    //   })
    return 
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  onFileChange(event) {
   
    for (var i = 0; i < event.target.files.length; i++) { 
        this.myFiles.push(event.target.files[i]);
    }
  }

  openFormAddNewStore() {
    const dialogRef = this.dialog.open(AddNewStoreComponent, {
      width: '50%',
    });

     dialogRef.afterClosed().subscribe(data_store => {
       var text = ""
       this.arrStore.push(data_store)
       for (var i=0;i<this.arrStore.length;i++){
          text = text + this.arrStore[i].name + ","
       }
       if (data_store != '') {
        this.partnerForm.value._store = data_store.name
        this.AddNewStoreReq = data_store
        this.partnerForm = this.formBuilder.group({
          _namaPerusahaan: [this.partnerForm.value._namaPerusahaan, Validators.required],
          _alamatPerusahaan: [this.partnerForm.value._alamatPerusahaan, Validators.required],
          _alamatDomisili: [this.partnerForm.value._alamatDomisili, Validators.required],
          _userType:[this.partnerForm.value._userType,Validators.required],
          _noTelp: [this.partnerForm.value._noTelp, Validators.required],
          _jenisUsaha: [this.partnerForm.value._jenisUsaha,Validators.required],
          _taxNumber: [this.partnerForm.value._taxNumber,Validators.required],
          _picName: [this.partnerForm.value._picName, Validators.required],
          _picPhone: [this.partnerForm.value._picPhone, Validators.required],
          _picEmail: [this.partnerForm.value._picEmail, Validators.required],
          _fileUpload:[''],
          _store: [text, ''],
          // _fileUpload:['', Validators.required]
        })
       }
    });
  }

}
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AddNewPartnerReq, AddNewStoreReq, AddNewPartnerRes, AddNewStoreResp } from 'src/app/models/models';
import { Router } from '@angular/router';
<<<<<<< HEAD
=======
import {MatRadioModule} from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
>>>>>>> c6f9994b96bc2b8f315b3c2fc16c0a025eabe055
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { AddNewStoreComponent } from '../add-new-store/add-new-store.component'

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})

export class AddPartnerComponent implements OnInit {
  data_store : AddNewStoreReq;
  partnerForm:FormGroup;
  AddNewPartnerReq : AddNewPartnerReq;
  AddNewStoreReq : AddNewStoreReq;
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
<<<<<<< HEAD
      _fileUpload:['']
=======
      _store: ['', ''],
      // _fileUpload:['', Validators.required]
>>>>>>> c6f9994b96bc2b8f315b3c2fc16c0a025eabe055
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
        this.UploadFile()
        this.snackBar.open('Success Save Data', 'close', this.matSnackBarConfig);        
        this.router.navigate(['/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Save data', 'close', this.matSnackBarConfig);
      this.router.navigate(['/program-management/data-partner']);
      return;
    });

    console.log('AddNewStoreReq : \n', this.AddNewStoreReq);
    this.apiService.APIAddNewStore(
      this.AddNewStoreReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewStoreResp) => {
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

    console.log('AddNewPartnerReq : \n', this.AddNewPartnerReq);
    this.apiService.APIAddNewPartner(
      this.AddNewPartnerReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewPartnerRes) => {
      if (res.data !== null) {
        this.UploadFile()
        this.snackBar.open('Success Submit Data', 'close', this.matSnackBarConfig);        
        this.router.navigate(['/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Submit data', 'close', this.matSnackBarConfig);
      this.router.navigate(['/program-management/data-partner']);
      return;
    });

    console.log('AddNewStoreReq : \n', this.AddNewStoreReq);
    this.apiService.APIAddNewStore(
      this.AddNewStoreReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewStoreResp) => {
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
<<<<<<< HEAD
  onFileChange(event) {
   
    for (var i = 0; i < event.target.files.length; i++) { 
        this.myFiles.push(event.target.files[i]);
    }
  }
=======

  openFormAddNewStore() {
    const dialogRef = this.dialog.open(AddNewStoreComponent, {
      width: '50%',
    });

     dialogRef.afterClosed().subscribe(data_store => {
       if (data_store != '') {
        this.partnerForm.value._store = data_store.name
        this.AddNewStoreReq = data_store
        this.partnerForm = this.formBuilder.group({
          _store: [data_store.name, ''],
          // _fileUpload:['', Validators.required]
        })
         console.log('Data Store :\n', this.partnerForm.value._store);
       }
    });
  }

>>>>>>> c6f9994b96bc2b8f315b3c2fc16c0a025eabe055
}
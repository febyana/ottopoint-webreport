import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AddNewPartnerReq, AddNewStoreReq, AddNewPartnerRes, AddNewStoreResp, PartnerUploadReq, PartnerUploadRes } from 'src/app/models/models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
  @ViewChild('saveFormButton', { static: false }) saveFormButton: any;
  @ViewChild('submitFormButton', { static: false }) submitFormButton: any;
  data_store: AddNewStoreReq;
  partnerForm: FormGroup;
  dataForm: FormGroup;
  AddNewPartnerReq: AddNewPartnerReq;
  AddNewStoreReq: AddNewStoreReq[];
  arrStore: AddNewStoreReq[] = [];
  partnerUploadreq: PartnerUploadReq;
  _whiteList: false
  _blackList: false
  fileImport: any = [];
  isLoadingResults = false;
  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };
  myFiles: string[] = [];


  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
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
      _userType: ['', Validators.required],
      _noTelp: ['', Validators.required],
      _jenisUsaha: ['', Validators.required],
      _taxNumber: ['', Validators.required],
      _picName: ['', Validators.required],
      _picPhone: ['', Validators.required],
      _picEmail: ['', Validators.required],
      _fileUpload: [''],
      _store: ['', ''],
    })
    // this.partnerForm = this.formBuilder.group({
    //   _namaPerusahaan: ['', ''],
    //   _alamatPerusahaan: ['', ''],
    //   _alamatDomisili: ['', ''],
    //   _userType: ['', ''],
    //   _noTelp: ['', ''],
    //   _jenisUsaha: ['', ''],
    //   _taxNumber: ['', ''],
    //   _picName: ['', ''],
    //   _picPhone: ['', ''],
    //   _picEmail: ['', ''],
    //   _fileUpload: [''],
    //   _store: ['', ''],
    //   // _fileUpload:['', Validators.required]
    // })
  }

  cancelForm() {
    this.snackBar.open('Cancel create data', 'close', this.matSnackBarConfig);
    this.router.navigate(['/dashboard/program-management/data-partner']);
  }
  saveData(status) {
    event.preventDefault();
    if (this.partnerForm.invalid) {
      return;
    }
    this.isLoadingResults = true;

    this.AddNewPartnerReq = {
      namaPerusahaan: this.partnerForm.value._namaPerusahaan,
      phoneNumber: this.partnerForm.value._noTelp,
      alamatPerusahaan: this.partnerForm.value._alamatPerusahaan,
      alamatDomisili: this.partnerForm.value._alamatDomisili,
      jenisUsaha: this.partnerForm.value._jenisUsaha,
      taxNumber: this.partnerForm.value._taxNumber,
      typeUser: this.partnerForm.value._userType,
      picNama: this.partnerForm.value._picName,
      picEmail: this.partnerForm.value._picEmail,
      picPhone: this.partnerForm.value._picPhone,
      status: status
    };

    console.log('AddNewPartnerReq : \n', this.AddNewPartnerReq);
    this.apiService.APIAddNewPartner(
      this.AddNewPartnerReq,
      window.localStorage.getItem('token')
    ).subscribe((res: AddNewPartnerRes) => {
      if (res.Data !== null) {
        if (this.arrStore.length > 0) {
          this.saveStore(res.Data["ID"])
        }
        if (this.fileImport.length >0) {
          this.submitImport(res.Data["ID"])
        }
        this.snackBar.open('Successfully Create Data', 'close', this.matSnackBarConfig);
        this.router.navigate(['/dashboard/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Create data', 'close', this.matSnackBarConfig);
      this.router.navigate(['/dashboard/program-management/data-partner']);
      return;
    });
  }

  saveStore(id) {
    if (this.arrStore.length > 0) {
      for (var i = 0; i < this.arrStore.length; i++) {
        this.arrStore[i].m_institution_id = id
        this.apiService.APIAddNewStore(
          this.arrStore[i],
          window.localStorage.getItem('token')
        ).subscribe((res: AddNewStoreResp) => {
          if (res.data !== null) {
            return;
          }
          this.snackBar.open('Failed Submit data', 'close', this.matSnackBarConfig);
          return;
        });
      }
    }
  }

  onImportFileChange(event, index) {
    let reader = new FileReader();
    let filesize = 0
    var file = new Array()
    if (event.target.files && event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        file.push(event.target.files[i])
      }
      for (var i = 0; i < file.length; i++) {
        filesize += file[i]["size"]
      }
      this.enableFormButton()
      if (filesize > 5242880) {
        this.disableFormButton()
        this.snackBar.open('filesize maximum is 5 MB', 'close', this.matSnackBarConfig);
        return
      }
      this.fileImport = file
    }
  }

  submitImport(id) {
    event.preventDefault();
    if (this.fileImport) {
      this.isLoadingResults = true;
      this.apiService.APIUploadPartner(
        window.localStorage.getItem('token'),
        this.fileImport,
        id)
        .subscribe(res => {
          let msg: any;
          this.isLoadingResults = false;
          if (res.Meta.message == 'SUCCESS') {
            msg = 'File Berhasil di Upload'
            this.snackBar.open(msg, 'close', this.matSnackBarConfig);
            return;
          }
        },
          error => {
            let msg: any;
            this.isLoadingResults = false;
            msg = 'File Gagal di Upload'
            this.snackBar.open(msg, 'close', this.matSnackBarConfig);
            return;
          }
        );
    }
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  openFormAddNewStore() {
    const dialogRef = this.dialog.open(AddNewStoreComponent, {
      width: '50%',
    });

     dialogRef.afterClosed().subscribe(data_store => {
       var text = ""
       this.arrStore.push(data_store)
       for (var i=0;i<this.arrStore.length;i++){
         if (this.arrStore[i].name != undefined) {
          text = text + this.arrStore[i].name + ","
         }
      }
       if (data_store != '') {
        this.partnerForm.value._store = data_store.name
        this.AddNewStoreReq = data_store
        this.partnerForm = this.formBuilder.group({
          _namaPerusahaan: [this.partnerForm.value._namaPerusahaan, Validators.required],
          _alamatPerusahaan: [this.partnerForm.value._alamatPerusahaan, Validators.required],
          _alamatDomisili: [this.partnerForm.value._alamatDomisili, Validators.required],
          _userType: [this.partnerForm.value._userType, Validators.required],
          _noTelp: [this.partnerForm.value._noTelp, Validators.required],
          _jenisUsaha: [this.partnerForm.value._jenisUsaha, Validators.required],
          _taxNumber: [this.partnerForm.value._taxNumber, Validators.required],
          _picName: [this.partnerForm.value._picName, Validators.required],
          _picPhone: [this.partnerForm.value._picPhone, Validators.required],
          _picEmail: [this.partnerForm.value._picEmail, Validators.required],
          _fileUpload: [''],
          _store: [text, ''],
          // _fileUpload:['', Validators.required]
        })
      }
    });
  }

  enableFormButton(){
    this.saveFormButton._disabled = false;
    this.submitFormButton._disabled = false;
  }
  disableFormButton(){
    this.saveFormButton._disabled = true;
    this.submitFormButton._disabled = true;
  }

}
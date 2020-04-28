import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AddNewStoreReq, AddNewStoreResp } from 'src/app/models/models';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-new-store',
  template:'<app-add_partner [nilai]="data_store"',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-new-store.component.html', 
  styleUrls: ['./add-new-store.component.css']
}) 
export class AddNewStoreComponent implements OnInit {
  // data_store: string;
  AddNewStoreReq : AddNewStoreReq;
  dataForm:FormGroup;
  isLoadingResults = false;
  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };


  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddNewStoreComponent>,
    private formBuilder : FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    
    // public data :AddNewPartnerReq
  ) { }
  
 
  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: [''],
      identifier: ['', Validators.required],
      street_name:['',Validators.required],
      unitname:['',Validators.required],
      building_name: ['', Validators.required],
      postal_code: ['',Validators.required],
      city: ['',Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      latitude: [''],
      longtitude:[''],
    })
  }

  submitForm() {
    console.log('Masuk');
    event.preventDefault();
    // if (this.dataForm.invalid) {
    //   return;
    // }
    this.isLoadingResults = true;

    this.AddNewStoreReq = {
        m_institution_id:0,
        name: this.dataForm.value.name,
        description: this.dataForm.value.desc,
        identifier: this.dataForm.value.identifier,
        streetname:this.dataForm.value.street_name,
        buildingname:this.dataForm.value.building_name,
        unitname: this.dataForm.value.unitname,
        postalcode:this.dataForm.value.postal_code,
        city: this.dataForm.value.city,
        province: this.dataForm.value.province,
        country:this.dataForm.value.country,
        latitude: this.dataForm.value.latitude,
        longtitude: this.dataForm.value.longtitude,
    };

    this.isLoadingResults = true;

    console.log('query : \n', this.AddNewStoreReq);
    this.dialogRef.close(this.AddNewStoreReq)
    // this.router.navigate(['/program-management/data-partner']);
  }

  cancelForm(){
    this.snackBar.open('Cancel create data', 'close', this.matSnackBarConfig);
    this.dialogRef.close(true);
    // this.router.navigate(['/program-management/data-partner']);
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
}
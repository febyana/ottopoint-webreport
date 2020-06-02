import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatSnackBarConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { EarningRuleReq, IssuerListRes, EarningRuleRes, VoucherListRes, SKUListRes } from 'src/app/models/models';
import {MatChipInputEvent} from '@angular/material/chips';

interface data {
  value: string;
  viewValue: string;
}

interface dataint{
  value : number;
  viewValue:string;
}

interface dataBool{
  value : boolean;
  viewValue:string;
}

@Component({
  selector: 'app-earning-rule',
  templateUrl: './earning-rule.component.html',
  styleUrls: ['./earning-rule.component.css']
})

export class EarningRuleComponent implements OnInit {
  @ViewChild('generalspendingrule', { static: false }) generalSpendingRule: ElementRef;
  @ViewChild('multiplyearningpoints', { static: false }) multiplyEarningPoints: ElementRef;
  @ViewChild('instantreward', { static: false }) instantreward: ElementRef;
  @ViewChild('customeventrule', { static: false }) customeventrule: ElementRef;
  @ViewChild('customreferral', { static: false }) customreferral: ElementRef;
  @ViewChild('eventrule', { static: false }) eventrule: ElementRef;
  @ViewChild('rewardcampaign', { static: false }) rewardcampaign: ElementRef;

  @ViewChild('dateata', { static: false }) dateata: ElementRef;
  @ViewChild('ulaperiod', { static: false }) ulaperiod: ElementRef;

  EarningRuleReq: EarningRuleReq;
  EarningRuleForm: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  excludedSKUs: string[] = [];
  skuIds : string[] = [];

  fq = {
    from_date: null,
    through_date: null
  };

  isLoadingResults = false;
  ula = false
  ata = false

  activities: dataBool[] = [
    { value: true, viewValue: 'Active' },
    { value: false, viewValue: 'Inactive' },
  ];

  typedetials: data[] = [
    { value: 'points', viewValue: 'General Spending Rule' },
    { value: 'multiply_for_product', viewValue: 'Multiply Earning Points' },
    { value: 'instant_reward', viewValue: 'Instant Reward' },
    { value: 'custom_event', viewValue: 'Custom Event Rule' },
    { value: 'event', viewValue: 'Event Rule' },
    { value: 'referral', viewValue: 'Customer Referral' },
  ];

  cr_eventnames: data[] = [
    { value: 'every_purchase', viewValue: 'Every Purchase' },
    { value: 'first_purchase', viewValue: 'First Purchase' },
    { value: 'register', viewValue: 'Register' },
  ];

  er_eventnames: data[] = [
    { value: 'account_created', viewValue: 'Account Created' },
    { value: 'customer_logged_in', viewValue: 'Customer Login' },
    { value: 'first_transaction', viewValue: 'First Purchase' },
    { value: 'newsletter_subscription', viewValue: 'Newsletter Subscription' },
  ];

  rewards: data[] = [
    { value: 'both', viewValue: 'Both' },
    { value: 'referred', viewValue: 'Referred' },
    { value: 'referrer', viewValue: 'Referrer' },
  ];

  partners: dataint[] = [];

  vouchers: data[] = [];
  
  periods: data[] = [
    { value: 'day', viewValue: 'Day' },
    { value: 'week', viewValue: 'Week' },
    { value: 'year', viewValue: 'Year' },
    { value: '3_months', viewValue: '3 Months' },
    { value: '6_months', viewValue: '6 Months' },
    { value: 'forever', viewValue: 'Forever' },
  ];

  levels: data[] = [
    { value: 'level0', viewValue: 'Level 0' },
    { value: 'level1', viewValue: 'Level 1' },
    { value: 'level2', viewValue: 'Level 2' },
    { value: 'level3', viewValue: 'Level 3' },
  ];

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.EarningRuleForm = this.formBuilder.group({
      _name: [''],
      _desc: [''],
      _activity: undefined,
      _partner: undefined,
      _typedetail: undefined,
      _gsr_pointValue: [''],
      _gsr_excludedSku: [''],
      _gsr_minOrderValue: [''],
      _mep_sku: [''],
      _mep_multiplier: [''],
      _cer_customEventName: [''],
      _cer_points: [''],
      _cer_ulacheckbox: false,
      _cer_period: undefined,
      _cer_limit: [''],
      _cr_eventName: undefined,
      _cr_reward: undefined,
      _cr_point: [''],
      _er_eventName: undefined,
      _er_points: [''],
      _atacheckbox: false,
      _fromDate: null,
      _toDate: null,
      _levels: undefined,
      _rewardCampaign: undefined
    })
    
    this.apiService.APIGetIssuerList(
      window.localStorage.getItem('token')
    ).subscribe((res: IssuerListRes) => {
      res.data.forEach(e => {
        this.partners.push({
           value: e.id, 
           viewValue: e.partnerId + " - " +e.institutionName
        });
      });
    });

    this.apiService.APIGetVoucherList(
      window.localStorage.getItem('token')
    ).subscribe((res: VoucherListRes) => {
      res.data.forEach(e => {
        this.vouchers.push({
           value: e.id, 
           viewValue: e.name
        });
      });
    });
  }

  addExSKU(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.excludedSKUs.push(value);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeExSKU(excludedSKU): void {
    const index = this.excludedSKUs.indexOf(excludedSKU);

    if (index >= 0) {
      this.excludedSKUs.splice(index, 1);
    }
  }

  addSKU(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.skuIds.push(value);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSKU(SKU): void {
    const index = this.skuIds.indexOf(SKU);

    if (index >= 0) {
      this.skuIds.splice(index, 1);
    }
  }

  ULACheckbox(event) {
    this.ula = event.checked
    if (this.ula) {
      this.renderer.setStyle(this.ulaperiod.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.ulaperiod.nativeElement, 'display', 'none');
    }
  }
  ATACheckbox(event) {
    this.ata = event.checked
    if (this.ata) {
      this.renderer.setStyle(this.dateata.nativeElement, 'display', 'none');
    } else {
      this.renderer.setStyle(this.dateata.nativeElement, 'display', 'block');
    }
  }

  typechange(value) {
    var element
    if (value == "points") {
      element = this.generalSpendingRule.nativeElement
    } else if (value == "multiply_for_product") {
      element = this.multiplyEarningPoints.nativeElement
    } else if (value == "custom_event") {
      element = this.customeventrule.nativeElement
    } else if (value == "referral") {
      element = this.customreferral.nativeElement
    } else if (value == "event") {
      element = this.eventrule.nativeElement
    } else if (value == "instant_reward") {
      element = this.instantreward.nativeElement
    }
    this.hideType()
    this.clearType()
    this.apiService.APIGetSKUList(
      window.localStorage.getItem('token')
    ).subscribe((res: SKUListRes) => {
      this.skuIds.push(res.data)
      this.excludedSKUs.push(res.data)
    });

    if (element == this.instantreward.nativeElement) {
      this.renderer.setStyle(this.rewardcampaign.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.rewardcampaign.nativeElement, 'display', 'none');
    }
    if (element != undefined) {
      if (value != "") {
        this.renderer.setStyle(element, 'display', 'block');
      }
    }
  }

  hideType() {
    this.renderer.setStyle(this.generalSpendingRule.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.multiplyEarningPoints.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.rewardcampaign.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.customeventrule.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.customreferral.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.eventrule.nativeElement, 'display', 'none');
  }

  clearForm(): void {
    this.EarningRuleForm.reset()
    this.hideType()
    this.renderer.setStyle(this.dateata.nativeElement, 'display', 'block');
  }

  saveForm() {
    event.preventDefault();
    // if (this.dataForm.invalid) {
    //   return;
    // }    
    this.isLoadingResults = true;
    var ula = false
    var ata = false
    if (this.ula) {
      ula = true
    }
    if (this.ata) {
      ata = true
    }
    var from, to, eventName, pointAmount
    if (this.EarningRuleForm.value._fromDate !== null) {
      from = this.datePipe.transform(this.EarningRuleForm.value._fromDate, 'yyyy-MM-dd')
    }
    if (this.EarningRuleForm.value._toDate !== null) {
      to = this.datePipe.transform(this.EarningRuleForm.value._toDate, 'yyyy-MM-dd')
    }

    if(this.EarningRuleForm.value._cer_customEventName != ""){
      eventName = this.EarningRuleForm.value._cer_customEventName
    }else if(this.EarningRuleForm.value._cr_eventName != ""){
      eventName = this.EarningRuleForm.value._cr_eventName
    }else{
      eventName =undefined
    }

    if (eventName == undefined) {
      eventName = this.EarningRuleForm.value._er_eventName
    }

    if(this.EarningRuleForm.value._cer_points != 0){
      pointAmount = this.EarningRuleForm.value._cer_points
    }else if(this.EarningRuleForm.value._cr_point != 0){
      pointAmount = this.EarningRuleForm.value._cr_point
    }else if(this.EarningRuleForm.value._er_points != 0) {
      pointAmount = this.EarningRuleForm.value._er_points
    }else{
      pointAmount = 0
    }
    

    this.EarningRuleReq = {
      name: this.EarningRuleForm.value._name,
      desc: this.EarningRuleForm.value._desc,
      active: this.EarningRuleForm.value._activity,
      institution_id : this.EarningRuleForm.value._partner,
      rewardCampaignId : this.EarningRuleForm.value._rewardCampaign,
      rewardType : this.EarningRuleForm.value._cr_reward,
      allTimeActive : ata,
      startAt:from,
      endAt:to,
      type : this.EarningRuleForm.value._typedetail,
      eventName:eventName,
      pointsAmount:Number(pointAmount),
      limitActive: ula,
      limitPeriod: this.EarningRuleForm.value._cer_period,
      limitLimit: Number(this.EarningRuleForm.value._cer_limit),
      pointValue : Number(this.EarningRuleForm.value._gsr_pointValue),
      minOrderValue : Number(this.EarningRuleForm.value._gsr_minOrderValue),
      excludedSkuSkuIds : this.excludedSKUs.toString(),
      skuIds : this.skuIds.toString()
    }
    
     this.apiService.APINewEarningRule(
      this.EarningRuleReq,
      window.localStorage.getItem('token')
    ).subscribe((res: EarningRuleRes) => {
      if (res.messages == "Success") {
        this.snackBar.open('Successfully Create Data', 'close', this.matSnackBarConfig);
        this.clearForm()
        // this.router.navigate(['/dashboard/program-management/data-partner']);
        return;
      }
      this.isLoadingResults = false;
      this.snackBar.open('Failed Create data', 'close', this.matSnackBarConfig);
      // this.router.navigate(['/dashboard/program-management/data-partner']);
      return;
    });

    this.isLoadingResults = true;
    // this.emptyValue();

    console.log('query : \n', this.EarningRuleReq);
    // this.dialogRef.close(this.AddNewStoreReq)
  }
  cancelForm() {
    this.clearForm()
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  clearType() {
    this.clearGSR()
    this.clearMEP()
    this.clearIR()
    this.clearCER()
    this.clearCR()
    this.clearER()
  }

  clearGSR() {
    this.EarningRuleForm.patchValue({
      _gsr_pointValue: '',
      _gsr_excludedSku: '',
      _gsr_minOrderValue: '',
    })
    this.excludedSKUs = []
  }

  clearMEP() {
    this.EarningRuleForm.patchValue({
      _mep_multiplier: '',
      _mep_sku: ''
    })
    this.skuIds = []
  }
  clearIR() {
    this.EarningRuleForm.patchValue({
      _rewardCampaign: ''
    })
  }
  clearCER() {
    this.EarningRuleForm.patchValue({
      _cer_customEventName: '',
      _cer_limit: '',
      _cer_period: undefined,
      _cer_points: '',
      _cer_ulacheckbox: false,
    })
    this.renderer.setStyle(this.ulaperiod.nativeElement, 'display', 'none');
  }
  clearER() {
    this.EarningRuleForm.patchValue({
      _er_eventName: undefined,
      _er_points: '',
    })
  }
  clearCR() {
    this.EarningRuleForm.patchValue({
      _cr_eventName: undefined,
      _cr_point: '',
      _cr_reward: undefined
    })
  }
}


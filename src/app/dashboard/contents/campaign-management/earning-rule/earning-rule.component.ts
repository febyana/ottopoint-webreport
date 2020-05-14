import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { EarningRuleReq } from 'src/app/models/models';
interface data {
  value: string;
  viewValue: string;
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

  EarningRuleReq: EarningRuleReq;
  EarningRuleForm: FormGroup;

  fq = {
    from_date: null,
    through_date: null
  };

  isLoadingResults = false;
  ula = false
  ata = false

  activities: data[] = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' },
  ];

  typedetials: data[] = [
    { value: 'general-spending-rule', viewValue: 'General Spending Rule' },
    { value: 'multiply-earning-points', viewValue: 'Multiply Earning Points' },
    { value: 'instant-reward', viewValue: 'Instant Reward' },
    { value: 'custom-event-rule', viewValue: 'Custom Event Rule' },
    { value: 'event-rule', viewValue: 'Event Rule' },
    { value: 'customer-referral', viewValue: 'Customer Referral' },
  ];

  cr_eventnames: data[] = [
    { value: 'every-purchase', viewValue: 'Every Purchase' },
    { value: 'first-purchase', viewValue: 'First Purchase' },
    { value: 'register', viewValue: 'Register' },
  ];

  er_eventnames: data[] = [
    { value: 'account-created', viewValue: 'Account Created' },
    { value: 'customer-login', viewValue: 'Customer Login' },
    { value: 'first-purchase', viewValue: 'First Purchase' },
    { value: 'newsletter-sub', viewValue: 'Newsletter Subscribtion' },
  ];

  rewards: data[] = [
    { value: 'both', viewValue: 'Both' },
    { value: 'referred', viewValue: 'Referred' },
    { value: 'referrer', viewValue: 'Referrer' },
  ];

  partners: data[] = [
    { value: 'partner1', viewValue: 'partner1' },
  ];
  periods: data[] = [
    { value: 'periods1', viewValue: 'periods1' },
  ];

  levels: data[] = [
    { value: 'level0', viewValue: 'Level 0' },
    { value: 'level1', viewValue: 'Level 1' },
    { value: 'level2', viewValue: 'Level 2' },
    { value: 'level3', viewValue: 'Level 3' },
  ];

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

  }
  ULACheckbox(event) {
    this.ula = event.checked
  }
  ATACheckbox(event) {
    this.ata = event.checked
    if (this.ata) {
      this.renderer.setStyle(this.dateata.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.dateata.nativeElement, 'display', 'none');
    }
  }

  typechange(value) {
    var element
    if (value == "general-spending-rule") {
      element = this.generalSpendingRule.nativeElement
    } else if (value == "multiply-earning-points") {
      element = this.multiplyEarningPoints.nativeElement
    } else if (value == "custom-event-rule") {
      element = this.customeventrule.nativeElement
    } else if (value == "customer-referral") {
      element = this.customreferral.nativeElement
    } else if (value == "event-rule") {
      element = this.eventrule.nativeElement
    } else if (value == "instant-reward") {
      element = this.instantreward.nativeElement
    }
    this.hideType()
    this.clearType()

    if (element == this.instantreward.nativeElement) {
      this.renderer.setStyle(this.rewardcampaign.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.rewardcampaign.nativeElement, 'display', 'none');
    }
    if (value != "none") {
      this.renderer.setStyle(element, 'display', 'block');
    }
  }

  hideType() {
    this.renderer.setStyle(this.generalSpendingRule.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.multiplyEarningPoints.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.instantreward.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.customeventrule.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.customreferral.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.eventrule.nativeElement, 'display', 'none');
  }

  clearForm(): void {
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
    this.renderer.setStyle(this.dateata.nativeElement, 'display', 'none');
    this.hideType()
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

    this.EarningRuleReq = {
      name: this.EarningRuleForm.value._name,
      desc: this.EarningRuleForm.value._desc,
      active: this.EarningRuleForm.value._activity,
      partner: this.EarningRuleForm.value._partner,
      alltimeactive: ata,
      fromdate: this.EarningRuleForm.value._fromDate,
      todate: this.EarningRuleForm.value._toDate,
      level: this.EarningRuleForm.value._levels,
      type: this.EarningRuleForm.value._typedetail,
      // general spending rule 
      gsr_pointvalue: this.EarningRuleForm.value._gsr_pointValue,
      gsr_excludedsku: this.EarningRuleForm.value._gsr_excludedSku,
      gsr_minordervalue: this.EarningRuleForm.value._gsr_minOrderValue,
      // multipy earning point 
      mep_sku: this.EarningRuleForm.value._mep_sku,
      mep_multiplier: this.EarningRuleForm.value._mep_multiplier,
      // custom event rule
      cer_customeventname: this.EarningRuleForm.value._cer_customEventName,
      cer_points: this.EarningRuleForm.value._cer_points,
      cer_ula: ula,
      cer_period: this.EarningRuleForm.value._cer_period,
      cer_limit: this.EarningRuleForm.value._cer_limit,
      // event rule
      er_eventname: this.EarningRuleForm.value._er_eventName,
      er_points: this.EarningRuleForm.value._er_points,
      // custom referral
      cr_eventname: this.EarningRuleForm.value._cr_eventName,
      cr_reward: this.EarningRuleForm.value._cr_reward,
      cr_point: this.EarningRuleForm.value._cr_point,
      //instant reward
      rewardcampaign: this.EarningRuleForm.value._rewardCampaign,
    };

    this.isLoadingResults = true;
    // this.emptyValue();

    console.log('query : \n', this.EarningRuleReq);
    // this.dialogRef.close(this.AddNewStoreReq)
  }
  cancelForm() {
    // alert("cancel")
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
  }

  clearMEP() {
    this.EarningRuleForm.patchValue({
      _mep_multiplier: '',
      _mep_sku: ''
    })
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


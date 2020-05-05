import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
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

  fq = { 
    from_date: null,
    through_date: null
  };
  ula=false
  ata=false

  activities: data[] = [
    {value: 'active', viewValue: 'Active'},
    {value: 'inactive', viewValue: 'Inactive'},
  ];

  typedetials: data[] = [
    {value: 'general-spending-rule', viewValue: 'General Spending Rule'},
    {value: 'multiply-earning-points', viewValue: 'Multiply Earning Points'},
    {value: 'instant-reward', viewValue: 'Instant Reward'},
    {value: 'custom-event-rule', viewValue: 'Custom Event Rule'},
    {value: 'event-rule', viewValue: 'Event Rule'},
    {value: 'customer-referral', viewValue: 'Customer Referral'},
  ];

  cr_eventnames: data[] = [
    {value: 'every-purchase', viewValue: 'Every Purchase'},
    {value: 'first-purchase', viewValue: 'First Purchase'},
    {value: 'register', viewValue: 'Register'},
  ];

  er_eventnames: data[] = [
    {value: 'account-created', viewValue: 'Account Created'},
    {value: 'customer-login', viewValue: 'Customer Login'},
    {value: 'first-purchase', viewValue: 'First Purchase'},
    {value: 'newsletter-sub', viewValue: 'Newsletter Subscribtion'},
  ];

  rewards: data[] = [
    {value: 'both', viewValue: 'Both'},
    {value: 'referred', viewValue: 'Referred'},
    {value: 'referrer', viewValue: 'Referrer'},
  ];

  levels: data[] = [
    {value: 'level0', viewValue: 'Level 0'},
    {value: 'level1', viewValue: 'Level 1'},
    {value: 'level2', viewValue: 'Level 2'},
    {value: 'level3', viewValue: 'Level 3'},
  ];

  EarningRuleForm: FormGroup;
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
      _activity: [''],
      _partner: [''],
      _typedetail :[''],
      _gsr_pointValue :[''],
      _gsr_excludedSku :[''],
      _gsr_minOrderValue:[''],
      _mep_sku:[''],
      _mep_multiplier:[''],
      _cer_customEventName:[''],
      _cer_points:[''],
      _cer_period:[''],
      _cer_limit:[''],
      _cr_eventName:[''],
      _cr_reward:[''],
      _cr_point:[''],
      _er_eventName:[''],
      _er_points:[''],
      _fromDate:[''],
      _toDate:[''],
      _levels:[''],
      _rewardCampaign:['']
    })

  }
  ULACheckbox(event){
    this.ula = event.checked
  }
  ATACheckbox(event){    
    this.ata = event.checked
  }

  typechange(value){
    var element
    if(value == "general-spending-rule"){
      element = this.generalSpendingRule.nativeElement
    }else if(value == "multiply-earning-points"){
      element = this.multiplyEarningPoints.nativeElement
    }else if(value == "custom-event-rule"){
      element = this.customeventrule.nativeElement
    }else if(value == "customer-referral"){
      element = this.customreferral.nativeElement
    }else if(value == "event-rule"){
      element = this.eventrule.nativeElement
    }else if(value == "instant-reward"){
      element = this.instantreward.nativeElement
    }

    this.renderer.setStyle(this.generalSpendingRule.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.multiplyEarningPoints.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.instantreward.nativeElement, 'display', 'none');  
    this.renderer.setStyle(this.customeventrule.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.customreferral.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.eventrule.nativeElement, 'display', 'none');    
    
    if (element == this.instantreward.nativeElement){
      this.renderer.setStyle(this.rewardcampaign.nativeElement, 'display', 'block');
    }else{
      this.renderer.setStyle(this.rewardcampaign.nativeElement, 'display', 'none');
    }
    this.renderer.setStyle(element, 'display', 'block');
  }

  saveForm(){
    alert(this.ata)
  }
  cancelForm(){
    alert("cancel")
  }

}

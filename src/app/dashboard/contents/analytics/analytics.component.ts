import { Component, NgZone } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ApiService } from '../../../api/api.service';
import {
  GetAnalyticsTransactionsRes,
  GetAnalyticsUsersRes
} from '../../../model/models';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
  total = 0;
  eligibleRegistered = 0;
  eligibleUnregistered = 0;
  uneligibleRegistered = 0;
  uneligibleUnregistered = 0;
  chartTransactionsHeight = window.screen.height * 0.44;
  charColorAmount = '#99cc00';
  charColorPoint = '#cc00cc';

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  private chartTransactions: am4charts.XYChart;

  constructor(
    private zone: NgZone,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.apiService.APIGetAnalyticsUsers(
      window.localStorage.getItem('token')
    ).subscribe((res: GetAnalyticsUsersRes) => {
      this.total = res.total;
      this.eligibleRegistered = res.eligible_registered;
      this.eligibleUnregistered = res.eligible_unregistered;
      this.uneligibleRegistered = res.uneligible_registered;
      this.uneligibleUnregistered = res.uneligible_unregistered;
    });
    // chart transactions
    this.chartTransactions = am4core.create('chartTransactions', am4charts.XYChart);
    this.apiService.APIGetAnalyticsTransactions(
      window.localStorage.getItem('token')
    ).subscribe((res: GetAnalyticsTransactionsRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }

      if (res.total === 0) {
        this.snackBar.open(res.message, 'close', this.matSnackBarConfig);
        return;
      }

      const data = [];
      for (let i = 0; i < res.total; i++) {
        data.push({ date1: new Date(
          +res.data[i].tahun,
          +res.data[i].bulan - 1,
          +res.data[i].hari,
        ), amount: res.data[i].amount });
      }
      for (let i = 0; i < res.total; i++) {
        data.push({ date2: new Date(
          +res.data[i].tahun,
          +res.data[i].bulan - 1,
          +res.data[i].hari,
        ), point: res.data[i].point });
      }

      this.chartTransactions.data = data;

      const dateAxis = this.chartTransactions.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.labels.template.fill = am4core.color(this.charColorAmount);
      const dateAxis2 = this.chartTransactions.xAxes.push(new am4charts.DateAxis());
      dateAxis2.renderer.grid.template.location = 0;
      dateAxis2.renderer.labels.template.fill = am4core.color(this.charColorPoint);

      const valueAxis = this.chartTransactions.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.labels.template.fill = am4core.color(this.charColorAmount);
      const valueAxis2 = this.chartTransactions.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.tooltip.disabled = true;
      valueAxis2.renderer.grid.template.strokeDasharray = '2,3';
      valueAxis2.renderer.labels.template.fill = am4core.color(this.charColorPoint);
      if (window.screen.width <= 510) {
        valueAxis.renderer.width = 0;
        valueAxis.renderer.visible = false;
        valueAxis2.renderer.width = 0;
        valueAxis2.renderer.visible = false;
      }

      const series = this.chartTransactions.series.push(new am4charts.LineSeries());
      series.name = 'Amount';
      series.dataFields.dateX = 'date1';
      series.dataFields.valueY = 'amount';
      series.tooltipText = '{valueY.value}';
      series.fill = am4core.color(this.charColorAmount);
      series.stroke = am4core.color(this.charColorAmount);
      series.strokeWidth = 1;
      const series2 = this.chartTransactions.series.push(new am4charts.LineSeries());
      series2.name = 'Point';
      series2.dataFields.dateX = 'date2';
      series2.dataFields.valueY = 'point';
      series2.yAxis = valueAxis2;
      series2.xAxis = dateAxis2;
      series2.tooltipText = '{valueY.value}';
      series2.fill = am4core.color(this.charColorPoint);
      series2.stroke = am4core.color(this.charColorPoint);
      series2.strokeWidth = 1;

      this.chartTransactions.cursor = new am4charts.XYCursor();
      this.chartTransactions.cursor.xAxis = dateAxis2;

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      this.chartTransactions.scrollbarX = scrollbarX;

      this.chartTransactions.legend = new am4charts.Legend();
      this.chartTransactions.legend.parent = this.chartTransactions.plotContainer;
      this.chartTransactions.legend.zIndex = 100;

      valueAxis2.renderer.grid.template.strokeOpacity = 0.1;
      dateAxis2.renderer.grid.template.strokeOpacity = 0.1;
      dateAxis.renderer.grid.template.strokeOpacity = 0.1;
      valueAxis.renderer.grid.template.strokeOpacity = 0.1;
    });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.chartTransactions) {
      this.chartTransactions.dispose();
    }
  }
}

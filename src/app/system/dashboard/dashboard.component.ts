import { Component, OnInit, ViewChild } from '@angular/core';
import { faEye, faShare } from '@fortawesome/free-solid-svg-icons';
import { PostsService } from 'src/app/service/posts/posts.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexTheme,
  ApexYAxis,
} from 'ng-apexcharts';
import { formatDate } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  yAxis: ApexYAxis;
  xAxis: ApexXAxis;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  faEye = faEye;
  faShare = faShare;
  dashboard;
  @ViewChild('chart') chart: ChartComponent;
  public viewChartOptions: Partial<ChartOptions>;
  public sharesChartOptions: Partial<ChartOptions>;
  constructor(private postService: PostsService) {
    this.viewChartOptions = {
      chart: {
        type: 'line',
        background: '#ffffff',
      },
      series: [
        {
          name: 'Views',
          data: [],
        },
      ],
      title: {
        text: 'Views',
        margin: 10,
        align: 'center',
        style: {
          color: '#0d6efd',
          fontFamily: 'Comfortaa',
          fontSize: '24px',
        },
      },
      yAxis: {
        labels: {
          style: {
            colors: '#0d6efd',
          },
        },
      },
      xAxis: {
        sorted: true,

        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: '#0d6efd',
            fontSize: '10px',
          },
        },
      },
    };
    this.sharesChartOptions = {
      chart: {
        type: 'line',
        background: '#ffffff',
      },
      series: [
        {
          name: 'Shares',
          data: [{ x: 0, y: 0 }],
        },
      ],
      title: {
        text: 'Shares',
        margin: 10,
        align: 'center',
        style: {
          color: '#0d6efd',
          fontFamily: 'Comfortaa',
          fontSize: '24px',
        },
      },
      yAxis: {
        labels: {
          style: {
            colors: '#0d6efd',
          },
        },
      },
      xAxis: {
        sorted: true,
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: '#0d6efd',
            fontSize: '10px',
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.postService.getDashboard().subscribe((res) => {
      this.dashboard = res;
      this.mapViewsObj();
      this.mapSharesObj();
      window.dispatchEvent(new Event('resize'));
    });
  }

  mapViewsObj() {
    this.viewChartOptions.series[0].data = [];
    let dashboard = {};
    const array = [];
    console.log(this.dashboard.views);
    for (const obj of this.dashboard.views) {
      const oldVal = dashboard[obj.day];
      if (oldVal) {
        dashboard[obj.day] += obj.num;
      } else {
        dashboard[obj.day] = obj.num;
      }
    }
    console.log(dashboard);

    for (const key in dashboard) {
      const data = {
        x: formatDate(key, 'MMM d, y', 'en-us'),
        y: dashboard[key],
      };

      array.push(data);
    }

    this.viewChartOptions.series[0].data = array;
  }

  mapSharesObj() {
    this.sharesChartOptions.series[0].data = [];
    const dashboard = {};
    const array = [];
    for (const obj of this.dashboard.shares) {
      if (dashboard[obj.day]) {
        dashboard[obj.day] += obj.num;
      } else {
        dashboard[obj.day] = obj.num;
      }
    }
    // console.log(dashboard);

    for (const key in dashboard) {
      const data = {
        x: formatDate(key, 'MMM d, y', 'en-us'),
        y: dashboard[key],
      };
      array.push(data);
    }
    this.sharesChartOptions.series[0].data = array;
  }
}

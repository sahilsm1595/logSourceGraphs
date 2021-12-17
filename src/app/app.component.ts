import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'chartsAssignment';

  public logsDetails: any = [];
  public statusArr: any = [];
  public countStatus: any = [];
  public chart: any = null;
  public activeChart: any = null;
  public optionsDonut: any;
  public percentArr: any = [];
  public statusPercentage: any = [];

  constructor(private http: HttpClient) {
    this.logsDetails = [];
    this.http
      .get('../assets/data/Test.csv', { responseType: 'text' })
      .subscribe(
        (data: string) => {
          const csvToRowArray = data.split('\n');
          for (let index = 1; index < csvToRowArray.length - 1; index++) {
            const row = csvToRowArray[index].split(',');
            let dateStr1 = row[1] + row[2];
            let dateStr2 = row[3] + row[4];
            this.logsDetails.push({
              name: row[0],
              lastEvent: dateStr1.replace(/(^"|"$)/g, ''),
              creationDate: dateStr2.replace(/(^"|"$)/g, ''),
              status: row[5],
            });

            this.percentArr.push(row[5]);
          }

          var result = this.logsDetails.reduce(
            (acc: any, o: any) => (
              (acc[o.status] = (acc[o.status] || 0) + 1), acc
            ),
            {}
          );

          this.statusArr = Object.keys(result);
          this.countStatus = Object.values(result);

          const totalItems = this.percentArr.length;
          const uniqueItems = [...new Set(this.percentArr)];
          uniqueItems.forEach((currColor) => {
            const numItems = this.percentArr.filter(
              (color: any) => color === currColor
            );

            this.statusPercentage.push((numItems.length * 100) / totalItems);
          });

          this.renderCharts();
        },
        (error: any) => {
          console.log(error);
        }
      );

    Chart.register(...registerables);
  }

  renderCharts() {
    this.optionsDonut = {
      indexAxis: 'y',
      legend: {
        display: false,
      },
    };
    this.chart = new Chart('myChart', {
      type: 'doughnut',
      data: {
        labels: this.statusArr,
        datasets: [
          {
            data: this.statusPercentage,
            backgroundColor: ['#008000', '#FF0000', '#f9d70a'],
            hoverOffset: 4,
          },
        ],
      },
    });

    this.activeChart = new Chart('activeChart', {
      type: 'bar',
      data: {
        labels: this.statusArr,
        datasets: [
          {
            label: 'Total logs with status',
            backgroundColor: ['#008000', '#FF0000', '#f9d70a'],
            data: this.countStatus,
          },
        ],
      },
      options: this.optionsDonut,
    });
  }
}

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
  p: number = 1;

  public logsDetails: any = [];
  public allLogsDetails: any = [];
  public allLogsHeader: any = [];

  public statusArr: any = [];
  public countStatus: any = [];
  public chart: any = null;
  public activeChart: any = null;
  public optionsDonut: any;
  public percentArr: any = [];
  public statusPercentage: any = [];
  public headerLogs: any = [];

  constructor(private http: HttpClient) {
    this.logsDetails = [];
    this.allLogsDetails = [];
    this.allLogsHeader = [];
    this.http
      .get('../assets/data/DummyData.csv', { responseType: 'text' })
      .subscribe(
        (data: string) => {
          let csvToRowArray = data.split('\n');

          csvToRowArray = csvToRowArray.map((item) => {
            return item.replace(/(\r\n|\n|\r)/gm, '');
          });

          this.allLogsHeader.push(...csvToRowArray[0].split(','));
          // console.log([...this.allLogsHeader]);
          this.headerLogs = [...this.allLogsHeader];
          for (let index = 1; index < csvToRowArray.length - 1; index++) {
            const rowO = csvToRowArray[index].split(',');
            let row = [...rowO];

            let dateStr1 = row[1] + row[2];
            let dateStr2 = row[3] + row[4];
            this.logsDetails.push({
              name: row[0],
              lastEvent: dateStr1.replace(/(^"|"$)/g, ''),
              creationDate: dateStr2.replace(/(^"|"$)/g, ''),
              status: row[5],
              timeline: row.slice(-7),
            });

            this.allLogsDetails.push(row[0], dateStr1, dateStr2, row[5]);

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

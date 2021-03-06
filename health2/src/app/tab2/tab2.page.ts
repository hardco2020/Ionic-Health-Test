import { Component } from '@angular/core';
import { Health } from '@awesome-cordova-plugins/health/ngx';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  bloodPressure = 'No Data';
  bodyFat = 'No Data';
  bodyTemperature = 'No Data';
  heartRate = 'No Data';
  highHeartRateNotifications = 'No Data';
  irregularRhythmNotifications = 'No Data';
  lowHeartRateNotifications = 'No Data';
  steps = 'No Data';
  weight = 'No Data';
  height = 'No Data';
  stepcount = 'No Data';
  workouts = [];
  constructor(private health: Health) {
    this.health
      .isAvailable()
      .then((available: boolean) => {
        console.log(available);
        this.health
          .requestAuthorization([
            'distance',
            'nutrition', //read and write permissions
            {
              read: [
                'steps',
                'height',
                'weight',
                'heart_rate',
                'blood_pressure',
                'gender',
                'temperature',
              ], //read only permission
              write: ['height', 'weight'], //write only permission
            },
          ])
          .then((res) => {
            console.log(res);
            console.log('hello');
            this.loadData();
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }

  reset() {
    this.loadData();
  }
  loadData() {
    // For height
    this.health
      .query({
        startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: 'height',
        limit: 1000,
      })
      .then((res) => {
        console.log(res[0].value);
        this.height = res[0].value + res[0].unit;
      });
    this.health
      .query({
        startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: 'blood_pressure',
        limit: 1000,
      })
      .then((res: any) => {
        this.bloodPressure =
          res[0].value.diastolic + '/' + res[0].value.systolic + res[0].unit;
      });
    this.health
      .query({
        startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: 'weight',
        limit: 1000,
      })
      .then((res: any) => {
        console.log(res);
        this.weight = res[0].value + res[0].unit;
      });
    this.health
      .query({
        startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: 'temperature',
        limit: 1000,
      })
      .then((res: any) => {
        console.log(res);
        this.bodyTemperature = res[0].value + res[0].unit;
      });
    this.health
      .query({
        startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: 'heart_rate',
        limit: 1000,
      })
      .then((res: any) => {
        console.log(res);
        this.heartRate = res[0].value + res[0].unit;
      });
  }
}

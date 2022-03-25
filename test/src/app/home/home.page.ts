import { Component } from '@angular/core';
import {
  HealthKit,
  HealthKitOptions,
} from '@awesome-cordova-plugins/health-kit/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  height: number;
  currentHeight = 'No Data';
  stepcount = 'No Data';
  workouts = [];
  constructor(private healthKit: HealthKit, private plt: Platform) {
    this.plt.ready().then(() => {
      this.healthKit.available().then((available) => {
        if (available) {
          // Request all permissions up front if you like to
          const options: HealthKitOptions = {
            readTypes: [
              'HKQuantityTypeIdentifierHeight',
              'HKQuantityTypeIdentifierStepCount',
              'HKWorkoutTypeIdentifier',
              'HKQuantityTypeIdentifierActiveEnergyBurned',
              'HKQuantityTypeIdentifierDistanceCycling',
            ],
            writeTypes: [
              'HKQuantityTypeIdentifierHeight',
              'HKWorkoutTypeIdentifier',
              'HKQuantityTypeIdentifierActiveEnergyBurned',
              'HKQuantityTypeIdentifierDistanceCycling',
            ],
          };
          this.healthKit.requestAuthorization(options).then((_) => {
            this.loadHealthData();
          });
        }
      });
    });
  }
  saveHeight() {
    this.healthKit.saveHeight({ unit: 'cm', amount: this.height }).then((_) => {
      this.height = null;
      this.loadHealthData();
    });
  }
  saveWorkout() {
    const workout = {
      activityType: 'HKWorkoutActivityTypeCycling',
      quantityType: 'HKQuantityTypeIdentifierDistanceCycling',
      startDate: new Date(), // now
      endDate: null, // not needed when using duration
      duration: 6000, //in seconds
      energy: 400, //
      energyUnit: 'kcal', // J|cal|kcal
      distance: 5, // optional
      distanceUnit: 'km',
    };
    this.healthKit.saveWorkout(workout).then((res) => {
      this.loadHealthData();
    });
  }
  loadHealthData() {
    this.healthKit.readHeight({ unit: 'cm' }).then(
      (val) => {
        this.currentHeight = val.value;
      },
      (err) => {
        console.log('error hieght: ', err);
      }
    );

    const stepOptions = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      unit: 'count',
      sampleType: 'HKQuantityTypeIdentifierStepCount',
    };

    this.healthKit.querySampleType(stepOptions).then(
      (data) => {
        const stepSum = data.reduce((a, b) => a + b.quantitiy, 0);
        this.stepcount = stepSum;
      },
      (err) => {
        console.log('error steps: ', err);
      }
    );

    this.healthKit.findWorkouts().then(
      (data) => {
        this.workouts = data;
      },
      (err) => {
        console.log('error workout', err);
        this.workouts = err;
      }
    );
  }
}

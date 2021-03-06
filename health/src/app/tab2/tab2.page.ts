import { Component } from '@angular/core';
import {
  HealthKit,
  HealthKitOptions,
} from '@awesome-cordova-plugins/health-kit/ngx';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  height: number;
  bloodPressure = 'No Data';
  bodyFat = 'No Data';
  bodyTemperature = 'No Data';
  heartRate = 'No Data';
  highHeartRateNotifications = 'No Data';
  irregularRhythmNotifications = 'No Data';
  lowHeartRateNotifications = 'No Data';
  steps = 'No Data';
  weight = 'No Data';
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
              'HKQunatityTypeIdentifierWeight',
              'HKQuantityTypeIdentifierBodyFatPercentage',
              'HKQuantityTypeIdentifierHeartRate',
              'HKCategoryTypeIdentifierHighHeartRate',
              'HKCategoryTypeIdentifierIrregularHeartRhythmEvent',
              'HKCategoryTypeIdentifierLowHeartRate',
            ],
            writeTypes: [
              'HKQuantityTypeIdentifierHeight',
              'HKWorkoutTypeIdentifier',
              'HKQuantityTypeIdentifierActiveEnergyBurned',
              'HKQuantityTypeIdentifierDistanceCycling',
              'HKQunatityTypeIdentifierWeight',
            ],
          };
          this.healthKit.requestAuthorization(options).then((_) => {
            this.loadHealthData();
          });
        }
      });
    });
  }
  // Save a new height
  saveHeight() {
    this.healthKit.saveHeight({ unit: 'cm', amount: this.height }).then((_) => {
      this.height = null;
      console.log('success');
      this.loadHealthData();
    });
  }
  // Save a new dummy workout
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

  // Reset()
  reset() {
    console.log('hello');
    this.loadHealthData();
  }
  // Reload all our data
  loadHealthData() {
    this.healthKit.readWeight({ unit: 'kg' }).then(
      (val) => {
        this.weight = val.value;
      },
      (err) => {
        console.log('No Weight: ', err);
      }
    );
    this.healthKit.readHeight({ unit: 'cm' }).then(
      (val) => {
        this.currentHeight = val.value;
      },
      (err) => {
        console.log('No height: ', err);
      }
    );

    const stepOptions = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      sampleType: 'HKQuantityTypeIdentifierStepCount',
      unit: 'count',
    };

    this.healthKit.querySampleType(stepOptions).then(
      (data) => {
        const stepSum = data.reduce((a, b) => a + b.quantity, 0);
        this.stepcount = stepSum;
      },
      (err) => {
        console.log('No steps: ', err);
      }
    );

    this.healthKit.findWorkouts().then(
      (data) => {
        this.workouts = data;
      },
      (err) => {
        console.log('no workouts: ', err);
        // Sometimes the result comes in here, very strange.
        this.workouts = err;
      }
    );
  }
}

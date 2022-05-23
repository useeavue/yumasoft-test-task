import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public formGroup: FormGroup;
  public formJSON: Array<any> = [];
  public titles: string[] = [];
  public buttonText: string = 'Продолжить';
  public isFormReady: boolean = false;

  constructor() {
    this.formGroup = new FormGroup({
      value: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^\[({(,?\s?"[\wа-яА-ЯёЁ]+"\s?:\s?"[^".?]*")+},?\s?)+\]$/
        ),
      ]),
    });
  }

  get controlJSON() {
    return this.formGroup.get('value') as FormControl;
  }

  private inputJSON(): void {
    this.formJSON = JSON.parse(this.controlJSON.value);
    this.formJSON.forEach((value) => {
      this.titles = Object.keys(value);
    });
    this.controlJSON.disable();
    this.buttonText = 'Выгрузить';
    this.isFormReady = true;
  }

  private outputJSON(): void {
    this.controlJSON.setValue(JSON.stringify(this.formJSON));
    this.controlJSON.enable();
    this.buttonText = 'Продолжить';
    this.isFormReady = false;
  }

  public submit(): void {
    !this.isFormReady ? this.inputJSON() : this.outputJSON();
  }
}

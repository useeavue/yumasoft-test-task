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
  public uploadButtonText: string = 'Загрузить из файла';
  public isFormReady: boolean = false;
  public isDownload: boolean = false;

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

  public inputJSON(data: any): void {
    this.formJSON = JSON.parse(data);
    this.formJSON.forEach((value) => {
      if (this.titles.length < Object.keys(value).length) {
        this.titles = Object.keys(value);
      }
    });
    this.controlJSON.disable();
    this.buttonText = 'Выгрузить';
    this.isFormReady = true;
  }

  public loadFromFile(fileInputValue: any) {
    const fileReader: FileReader = new FileReader();
    fileReader.readAsText(fileInputValue.target.files[0]);
    fileReader.onload = () => {
      this.inputJSON(fileReader.result);
    };
  }

  private outputJSON(): void {
    if (this.isDownload) {
      this.downloadFile();
    }
    this.controlJSON.setValue(JSON.stringify(this.formJSON));
    this.controlJSON.enable();
    this.buttonText = 'Продолжить';
    this.isFormReady = false;
  }

  private downloadFile(): void {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(this.formJSON)], {
      type: 'application/json',
    });
    a.href = URL.createObjectURL(file);
    a.download = 'data.json';
    a.click();
    a.remove();
  }

  public submit(): void {
    !this.isFormReady
      ? this.inputJSON(this.controlJSON.value)
      : this.outputJSON();
  }
}

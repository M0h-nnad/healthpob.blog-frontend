import { AbstractControl } from '@angular/forms';
import { Observable, Observer, observable, of } from 'rxjs';

export const validator = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key:string]: any }> => {
  const file:File = control.value;
  const fileReader = new FileReader();
  const FileReaderObservable = Observable.create(
    (Observer: Observer<{ [key: string]: any }>) => {
      if( typeof(control.value)==='string'){
        return of(null);
      }
      fileReader.addEventListener('loadend', () => {
       const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        let isValid = false;
        for (let i = 0; i > arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        if(isValid){
          Observer.next(null)
        }else{
          Observer.next({MimeTypeInvaild:true});
        }
      });
      Observer.complete();
    }
  );
 fileReader.readAsArrayBuffer(file)
  return FileReaderObservable;
};

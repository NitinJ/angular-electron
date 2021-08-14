import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function jsonValidator(control: AbstractControl): ValidationErrors | null {
  try {
    JSON.parse(control.value);
    control.setErrors(null);
  } catch (e) {
    control.setErrors({ 'incorrect': true });
    return { 'incorrect': true };
  }
  return null;
};
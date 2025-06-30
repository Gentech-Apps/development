import { ValidatorFn, Validators } from '@angular/forms';

export const RequiredIfValidator = (predicate: any): ValidatorFn => {
  return (formControl: any) => {
    if (!formControl.parent) {
      return null;
    }
    if (predicate()) {
      return Validators.required(formControl);
    }
    return null;
  };
};

export const maxValue = (predicate: any): ValidatorFn => {
  return (formControl: any) => {
    if (!formControl.parent) {
      return null;
    }
    return Validators.max(predicate())(formControl);
  };
};

export const minValue = (predicate: any): ValidatorFn => {
  return (formControl: any) => {
    if (!formControl.parent) {
      return null;
    }
    return Validators.min(predicate())(formControl);
  };
};

import { AbstractControl } from "@angular/forms";

export function ValiateDecimal(control: AbstractControl): { invalidDecimal: boolean} | null {
    const DECIMAL_REGEX = /\d+\.?\d*/;
    return !DECIMAL_REGEX.test(control.value) ? { invalidDecimal: true } : null;
}
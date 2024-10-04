import { AbstractControl } from "@angular/forms";

export function ValiateInt(control: AbstractControl): { invalidInt: boolean} | null {
    const INT_REGEX = /^\d+$/;
    return !INT_REGEX.test(control.value) ? { invalidInt: true } : null;
}
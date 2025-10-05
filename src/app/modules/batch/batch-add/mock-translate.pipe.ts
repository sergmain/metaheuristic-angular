import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translate',  // Matches the real pipe's name
    standalone: true,   // Matches ngx-translate v17's standalone design
    pure: false         // If your real usage needs impurity; adjust as needed
})
export class MockTranslatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return value;  // Or return a placeholder like `${value}-mock` for debugging
    }
}
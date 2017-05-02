import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUnknownPipe'
})
export class FilterUnknownPipe implements PipeTransform {

  transform(componentList: any[], args?: any): any {
    return componentList.filter(component => component.value !== 'Unknown');
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sref'
})
export class SrefPipe implements PipeTransform {

  transform(items: any, searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText?.toLocaleLowerCase();

    return items.filter((it: any) => {
      return (it?.sref2?.toLocaleLowerCase()?.includes(searchText))

    });
  }

}

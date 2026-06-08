import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'product'
})
export class ProductPipe implements PipeTransform {


  transform(items: any, searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText?.toLocaleLowerCase();

    return items.filter((it: any) => {
      return (it?.sref1?.toLocaleLowerCase()?.includes(searchText) )

    });
  }

}

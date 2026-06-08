import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'produit'
})
export class  ProduitPipe implements PipeTransform {

  transform(items: any, searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText?.toLocaleLowerCase();

    return items.filter((it: any) => {
      return (it?.des?.toLocaleLowerCase()?.includes(searchText)|| it?.ref?.toLocaleLowerCase()?.includes(searchText))

    });
  }

}

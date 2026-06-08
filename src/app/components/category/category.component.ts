import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  categories : any
  products: any
  product : any
  category :any

  constructor(private articleService: ArticleService,private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.getCategoryByCategory(this.route.snapshot.paramMap.get('category'));

  }

  getCategoryByCategory(category : any) {
    this.articleService.getCategoryByCategory(category).subscribe(
      (res : any) =>
      {
        this.category = res;
      }
    )
  }
  getAllProducts() {
    this.articleService.getArticle().subscribe(
      (res: any) => {
        this.products = res
      }
    )
  }
}

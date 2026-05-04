import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { CategoryModalComponent } from '../../modals/category-modal/category-modal.component';
import { categoryModel } from 'src/app/models/category/categoryModel';
import { CategoryService } from 'src/app/services/category/category-service';

import { addIcons } from 'ionicons';
import { apps, pricetag, add } from 'ionicons/icons';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CategoryListComponent implements OnInit {

  public categories: categoryModel[] = [];

  constructor(private categoryService: CategoryService, private modalCtrl: ModalController) {
    addIcons({ apps, pricetag, add });
  }

  async openCategoryModal(category?: categoryModel) {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { categoryData: category },
      initialBreakpoint: 0.65,
      breakpoints: [0, 0.65, 0.9],
      cssClass: 'custom-bottom-sheet'
    });

    modal.onDidDismiss().then(async () => {
      await this.getCategoryList();
    });

    return await modal.present();
  }

  async ngOnInit(): Promise<void> {
    await this.getCategoryList();
  }

  public async getCategoryList(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
  }
}

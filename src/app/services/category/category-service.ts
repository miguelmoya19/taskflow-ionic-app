import { Injectable } from '@angular/core';
import { categoryModel } from 'src/app/models/category/categoryModel';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
    private storageKey = 'categories';

  getCategories(): categoryModel[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]') as categoryModel[];
  }

  saveCategories(categories: categoryModel[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(categories));
  }

  addCategory(category: categoryModel) {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  deleteCategory(id: number) {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(categories);
  }

  updateCategory(category: categoryModel) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
      this.saveCategories(categories);
    }
  }
  
}

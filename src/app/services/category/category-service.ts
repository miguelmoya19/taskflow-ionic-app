import { Injectable, Inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { categoryModel } from 'src/app/models/category/categoryModel';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private storageKey = 'categories';
  private categories: categoryModel[] = [];
  private ready: Promise<void>;

  constructor(@Inject(Storage) private storage: Storage) {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    await this.storage.create();
    const stored = await this.storage.get(this.storageKey);
    this.categories = Array.isArray(stored) ? stored : [];
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  public async getCategories(): Promise<categoryModel[]> {
    await this.ensureReady();
    return [...this.categories];
  }

  public async saveCategories(categories: categoryModel[]): Promise<void> {
    await this.ensureReady();
    this.categories = [...categories];
    await this.storage.set(this.storageKey, this.categories);
  }

  public async addCategory(category: categoryModel): Promise<void> {
    await this.ensureReady();
    const categories = [...this.categories, category];
    await this.saveCategories(categories);
  }

  public async deleteCategory(id: number): Promise<void> {
    await this.ensureReady();
    const categories = this.categories.filter(c => c.id !== id);
    await this.saveCategories(categories);
  }

  public async updateCategory(category: categoryModel): Promise<void> {
    await this.ensureReady();
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      const categories = [...this.categories];
      categories[index] = category;
      await this.saveCategories(categories);
    }
  }
}

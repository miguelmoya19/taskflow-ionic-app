import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskModel } from 'src/app/models/task/taskModel';
import { categoryModel } from 'src/app/models/category/categoryModel';
import { TaskService } from 'src/app/services/task/task-service';
import { CategoryService } from 'src/app/services/category/category-service';
import { TaskModalComponent } from 'src/app/modals/task-modal/task-modal.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TaskListComponent implements OnInit {

   public tasks: TaskModel[] = [];
   public filteredTasks: TaskModel[] = [];
   public categories: categoryModel[] = [];
   public selectedCategoryId: number | null = null;

   constructor( 
    private taskService: TaskService, 
    private readonly categoryServive: CategoryService,
    private readonly modalCtrl: ModalController
  ){}

  ngOnInit(): void {
    this.getCategoryList();
    this.getTaskList();
  }

    public getTaskList(): void {
    this.tasks = this.taskService.getTasks();
    this.filterTasks();
  }

  private getCategoryList(): void {
    this.categories = this.categoryServive.getCategories();
  }

  public async editTask(task: TaskModel): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskModalComponent,
      componentProps: {
        task,
        isEdit: true
      },
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
      cssClass: 'custom-bottom-sheet'
    });

    modal.onDidDismiss().then((event) => {
      if (event.data?.taskUpdated) {
        this.getTaskList();
      }
    });

    await modal.present();
  }

  public deleteTaskList(id:number): void {
    this.taskService.deleteTask(id);
    this.getTaskList();
  }

  public selectCategory(id: number | null): void {
    this.selectedCategoryId = id;
    this.filterTasks();
  }

  private filterTasks(): void {
    this.filteredTasks = this.selectedCategoryId === null
      ? [...this.tasks]
      : this.tasks.filter(task => task.categoryId === this.selectedCategoryId);
  }

  public mapCategoryName(id: number): string {

   const categoryName = this.categoryServive.getCategories().find(c => c.id === id)?.name ?? "No se encontró la categoría";

    return categoryName;
  }

}

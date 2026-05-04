import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskModel } from 'src/app/models/task/taskModel';
import { TaskService } from 'src/app/services/task/task-service';
import { categoryModel } from 'src/app/models/category/categoryModel';
import { CategoryService } from 'src/app/services/category/category-service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,ReactiveFormsModule ]
})
export class TaskModalComponent implements OnInit {

  @Input() task?: TaskModel;
  @Input() isEdit = false;

  public taskForm!: FormGroup;
  private localDate = new Date().toISOString();

  public tasks: TaskModel[] = [];
  public categories: categoryModel[] = [];

  get getterForm(): FormGroup {
    return this.taskForm;
  }

  get getterId(): number {
    const id = this.tasks.length
      ? Math.max(...this.tasks.map(t => t.id)) + 1
      : 1;

    return id;
  }

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly formBuilder: FormBuilder,
    private readonly taskService: TaskService,
    private readonly categoryService: CategoryService,
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      completed: [false],
      categoryId: [null],
      dateTime: [this.localDate]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
    await this.loadCategories();

    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        completed: this.task.completed,
        categoryId: this.task.categoryId,
        dateTime: this.task.dateTime
      });
    }
  }

  public dismiss(): void {
    this.modalCtrl.dismiss();
  }

  public async saveTask(): Promise<void> {
    const { title, completed, categoryId, dateTime } = this.getterForm.controls;

    if (this.taskForm.valid) {
      const task: TaskModel = {
        id: this.task?.id ?? this.getterId,
        title: title.value,
        completed: completed.value,
        categoryId: categoryId.value,
        dateTime: dateTime.value
      };

      if (this.isEdit && this.task) {
        await this.taskService.updateTask(task);
        this.modalCtrl.dismiss({ taskUpdated: true });
      } else {
        await this.taskService.addTask(task);
        this.modalCtrl.dismiss({ taskAdded: true });
      }
    }
  }

  private async loadTasks(): Promise<void> {
    this.tasks = await this.taskService.getTasks();
  }

  private async loadCategories(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
  }
}

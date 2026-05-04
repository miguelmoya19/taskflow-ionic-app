import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { TaskModel } from 'src/app/models/task/taskModel';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private storageKey = 'tasks';
  private tasks: TaskModel[] = [];
  private tasksChanged = new Subject<void>();
  public tasksChanged$ = this.tasksChanged.asObservable();
  private ready: Promise<void>;

  constructor(@Inject(Storage) private storage: Storage) {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    await this.storage.create();
    const stored = await this.storage.get(this.storageKey);
    this.tasks = Array.isArray(stored) ? stored : [];
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  public async getTasks(): Promise<TaskModel[]> {
    await this.ensureReady();
    return [...this.tasks];
  }

  public async saveTasks(tasks: TaskModel[]): Promise<void> {
    await this.ensureReady();
    this.tasks = [...tasks];
    await this.storage.set(this.storageKey, this.tasks);
  }

  public async addTask(task: TaskModel): Promise<void> {
    await this.ensureReady();
    const tasks = [...this.tasks, task];
    await this.saveTasks(tasks);
    this.tasksChanged.next();
  }

  public async deleteTask(id: number): Promise<void> {
    await this.ensureReady();
    const tasks = this.tasks.filter(t => t.id !== id);
    await this.saveTasks(tasks);
    this.tasksChanged.next();
  }

  public async updateTask(task: TaskModel): Promise<void> {
    await this.ensureReady();
    const tasks = this.tasks.map(t => t.id === task.id ? task : t);
    await this.saveTasks(tasks);
    this.tasksChanged.next();
  }

  public async toggleTask(id: number): Promise<void> {
    await this.ensureReady();
    const tasks = this.tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    await this.saveTasks(tasks);
    this.tasksChanged.next();
  }
}

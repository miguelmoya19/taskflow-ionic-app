import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskModel } from 'src/app/models/task/taskModel';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

   private storageKey = 'tasks';
   private tasksChanged = new Subject<void>();
   public tasksChanged$ = this.tasksChanged.asObservable();

  getTasks(): TaskModel[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]') as TaskModel[];
  }

  saveTasks(tasks: TaskModel[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  addTask(task: TaskModel) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
    this.tasksChanged.next();
  }

  deleteTask(id: number) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
    this.tasksChanged.next();
  }

  updateTask(task: TaskModel) {
    const tasks = this.getTasks().map(t => t.id === task.id ? task : t);
    this.saveTasks(tasks);
    this.tasksChanged.next();
  }

  toggleTask(id: number) {
    const tasks = this.getTasks().map(t => {
      if (t.id === id) t.completed = !t.completed;
      return t;
    });
    this.saveTasks(tasks);
    this.tasksChanged.next();
  }
  
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { TaskModalComponent } from '../../modals/task-modal/task-modal.component';
import { TaskService } from 'src/app/services/task/task-service';
import { DashTotal } from 'src/app/models/dashboard/dashTotal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TaskListComponent, CategoryListComponent, TaskModalComponent]
})
export class DashboardPage implements OnInit, OnDestroy {

  @ViewChild(TaskListComponent) taskList!: TaskListComponent;
  private tasksSub = new Subscription();

  public dashTotal: DashTotal = {
    total: 0,
    pending: 0,
    completed: 0
  };

  constructor(private readonly taskService: TaskService) {}

  async ngOnInit(): Promise<void> {
    await this.taskCounters();
    this.tasksSub = this.taskService.tasksChanged$.subscribe(async () => {
      await this.taskCounters();
      await this.taskList?.getTaskList();
    });
  }

  public async onModalDismiss(event: any): Promise<void> {
    if (event.detail.data?.taskAdded || event.detail.data?.taskUpdated) {
      await this.taskList.getTaskList();
      await this.taskCounters();
    }
  }

  public async taskCounters(): Promise<void> {
    const tasks = await this.taskService.getTasks();

    this.dashTotal.total = tasks.length;
    this.dashTotal.pending = tasks.filter(p => !p.completed).length;
    this.dashTotal.completed = tasks.filter(c => c.completed).length;
  }

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
  }
}

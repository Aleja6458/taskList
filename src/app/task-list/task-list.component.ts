import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit  {
  public tasks: Task[] = [];
  protected selectedTask: Task = { id: 0, name: '', description: '', iscomplete: false };
  protected isEditMode = false;

  constructor(private taskService: TaskService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadTasks();
    this.taskService.getTasksUpdatedListener().subscribe(() => {
      this.loadTasks();
    });
  }

  public addTask(name: string, description: string, iscomplete: boolean): void {
    this.taskService.addTask(name, description, iscomplete).subscribe(task => {
      this.tasks.push(task);
    });
  }

  public completeTask(id: number, name: string | null, description: string | null): void {
    this.taskService.completeTask(id, name, description ).subscribe(() => {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.iscomplete = true;
        this.cdRef.detectChanges();
      }
    });
  }

  public editTask(task: Task): void {
    this.selectedTask = { ...task };
    this.isEditMode = true;
  }

  public deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.cdRef.detectChanges();
    });
  }

  filterTasks(filter: string): void {
    if (filter === 'all') {
      this.loadTasks();
    } else {
      const isComplete = filter === 'completed';
      this.taskService.getFilteredTasks(isComplete).subscribe(tasks => {
        this.tasks = tasks;
      });
    }
  }

  protected loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }
  
}
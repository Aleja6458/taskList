import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../models/task.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Input() task: Task = { id: 0, name: '', description: '', iscomplete: false };

  @Output() taskUpdated = new EventEmitter<void>();
  @ViewChild('taskForm') taskForm!: NgForm;

  constructor(private taskService: TaskService) {}

  saveTask(): void {
    this.taskService.addTask(this.task.name, this.task.description, this.task.iscomplete)
      .subscribe(response => {
        this.taskUpdated.emit(); // Emitir evento para notificar al componente padre
        this.resetForm();
      }, error => {
        console.error('Error adding task', error);
      });
  }

  resetForm(): void {
    this.task = { id: 0, name: '', description: '', iscomplete: false };
    this.taskForm.resetForm();
  }
}

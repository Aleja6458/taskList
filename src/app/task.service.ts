import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5292/api/tasks';
  private tasksUpdated = new Subject<void>();

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getFilteredTasks(isComplete: boolean): Observable<Task[]> {
    const url = `${this.apiUrl}/filter?isComplete=${isComplete}`;
    return this.http.get<Task[]>(url);
  }

  getTasksUpdatedListener(): Observable<void> {
    return this.tasksUpdated.asObservable();
  }

  addTask(name: string, description: string, iscomplete: boolean): Observable<Task> {
    console.log("addTask service")
    console.log(name,description,iscomplete)
    const newTask: Task = {
      id: 0, // El ID será asignado por el servidor
      name,
      description,
      iscomplete
    };
    return this.http.post<Task>(this.apiUrl, newTask, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  completeTask(id: number, name: string | null, description: string | null): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    
    const updatePayload = {
      name: name, 
      description: description,  
      isComplete: true
    };
  
    return this.http.put<void>(url, updatePayload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  putTask(id: number, name: string, description: string, iscomplete: boolean): Observable<Task> {
    const updatedTask: Task = {
      id,
      name,
      description,
      iscomplete
    };
    return this.http.put<Task>(`${this.apiUrl}/${id}`, updatedTask, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(() => {
        this.tasksUpdated.next();
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject {

  projectTitle = '';
  projectDescription = '';
  taskTitle = '';
  tasks: { title: string }[] = [];

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}
  
  addTask() {
    if (this.projectTitle.trim() === '') {
      alert('Please enter a project title before adding tasks!');
      return;
    } 
    if (this.taskTitle.trim() === '') {
      alert('Please enter a task title!');
      return;
    }
    this.tasks.push({ title: this.taskTitle });
    this.taskTitle = '';
  }

   removeTask(i: number) {
    this.tasks.splice(i, 1);
  }

  saveProject() {
    if (this.projectTitle.trim() === '') {
      alert('Please enter a project title!');
      return;
    }

    const project = {
      title: this.projectTitle,
      description: this.projectDescription,
      leader: 1  // hethi pour le moment baad nbadelha b session user id 
    };

    this.projectService.createProject(project).subscribe({
      next: (createdProject: any) => {
        console.log('Project created:', createdProject);

    const taskRequests = this.tasks.map(task => {
          return this.projectService.createTask({
            title: task.title,
            project_id: createdProject.id,
            created_by: 1  // hardcoded for now
          });
        });

     let completed = 0;
        if (taskRequests.length === 0) {
          alert('Project created successfully! ✅');
          this.router.navigate(['/projects']);
          return;
        }
    taskRequests.forEach(request => {
          request.subscribe({
            next: () => {
              completed++;
              if (completed === taskRequests.length) {
                alert('Project and tasks created successfully! ✅');
                this.router.navigate(['/projects']);
              }
            },
            error: (err : any) => {
              console.error('Task error:', err);
              alert('Project saved but some tasks failed ⚠️');
            }
          });
        });
      },
      error: (err : any) => {
        console.error('Project error:', err);
        alert('Failed to create project ❌');
      }
    });
  }

  cancelProject() {
    this.router.navigate(['/projects']);
  }
}
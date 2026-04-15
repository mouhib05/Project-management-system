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
    tasks: { title: string, subtasks: string[], newSubtask: string, showForm: boolean }[] = [];

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
      this.tasks.push({
        title: this.taskTitle,
        subtasks: [],
        newSubtask: '',
        showForm: false
      });
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
        leader: 1
      };

      this.projectService.createProject(project).subscribe({
        next: (createdProject: any) => {
          console.log('Project created:', createdProject);

          // no tasks → done
          if (this.tasks.length === 0) {
            alert('Project created successfully! ✅');
            this.router.navigate(['/project-list']);
            return;
          }

          let tasksCompleted = 0;

          this.tasks.forEach(task => {
            this.projectService.createTask({
              title: task.title,
              project_id: createdProject.id,  // ← lowercase id
              created_by: 1
            }).subscribe({
              next: (createdTask: any) => {
                console.log('Task created:', createdTask);

                // no subtasks → count task as done
                if (task.subtasks.length === 0) {
                  tasksCompleted++;
                  if (tasksCompleted === this.tasks.length) {
                    alert('Project and tasks created! ✅');
                    this.router.navigate(['/project-list']);
                  }
                  return;
                }

                // save subtasks
                let subtasksCompleted = 0;
                task.subtasks.forEach(subtaskTitle => {
                  this.projectService.createSubtask({
                    title: subtaskTitle,
                    task_id: createdTask.id,  // ← lowercase id
                    status: 'pending',
                    weight_percentage: 0,
                    assigned_to: null
                  }).subscribe({
                    next: (createdSubtask: any) => {
                      console.log('Subtask created:', createdSubtask);
                      subtasksCompleted++;
                      if (subtasksCompleted === task.subtasks.length) {
                        tasksCompleted++;
                        if (tasksCompleted === this.tasks.length) {
                          alert('Project, tasks and subtasks created! ✅');
                          this.router.navigate(['/project-list']);
                        }
                      }
                    },
                    error: (err: any) => console.error('Subtask error:', err)
                  });
                });
              },
              error: (err: any) => console.error('Task error:', err)
            });
          });
        },
        error: (err: any) => {
          console.error('Project error:', err);
          alert('Failed to create project ❌');
        }
      });
    }

    cancelProject() {
      this.router.navigate(['/project-list']);
    }

    toggleSubtaskForm(index: number) {
      this.tasks[index].showForm = !this.tasks[index].showForm;
    }

    addSubtask(index: number) {
      if (this.tasks[index].newSubtask.trim() === '') {
        alert('Please enter a subtask title!');
        return;
      }
      this.tasks[index].subtasks.push(this.tasks[index].newSubtask);
      this.tasks[index].newSubtask = '';
    }

    removeSubtask(taskIndex: number, subtaskIndex: number) {
      this.tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    }
  }
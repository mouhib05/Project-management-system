import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project';

@Component({                          // ← this was removed
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {

  projects: any[] = [];
  filteredProjects: any[] = [];
  searchText = '';

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.projectService.getProjects().subscribe({
      next: (data: any) => {
        this.projects = data;
        this.filteredProjects = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });
  }

  searchProjects() {
    if (this.searchText.trim() === '') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.cdr.detectChanges();
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  // Track which sections are expanded
  expandedSections: { [key: string]: boolean } = {
    dashboard: true,  // Start with dashboard expanded
    users: false
  };

  // Toggle section expansion
  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
}

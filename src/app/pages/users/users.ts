import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  avatar: string;
  department: string;
  lastLogin: string;
}

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  users: User[] = [];
  selectedUsers: User[] = [];
  loading: boolean = true;
  searchValue: string = '';

  // Filter options
  statuses = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Pending', value: 'Pending' }
  ];

  roles = [
    { label: 'All Roles', value: null },
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'User', value: 'User' },
    { label: 'Developer', value: 'Developer' }
  ];

  ngOnInit() {
    // Simulate API call
    setTimeout(() => {
      this.users = this.getMockUsers();
      this.loading = false;
    }, 1000);
  }

  getMockUsers(): User[] {
    return [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Admin',
        status: 'Active',
        joinDate: '2024-01-15',
        avatar: 'SJ',
        department: 'Engineering',
        lastLogin: '2 hours ago'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        role: 'Developer',
        status: 'Active',
        joinDate: '2024-02-20',
        avatar: 'MC',
        department: 'Engineering',
        lastLogin: '5 hours ago'
      },
      {
        id: 3,
        name: 'Emma Wilson',
        email: 'emma.wilson@company.com',
        role: 'Manager',
        status: 'Active',
        joinDate: '2023-11-10',
        avatar: 'EW',
        department: 'Marketing',
        lastLogin: '1 day ago'
      },
      {
        id: 4,
        name: 'James Martinez',
        email: 'james.martinez@company.com',
        role: 'User',
        status: 'Inactive',
        joinDate: '2024-03-05',
        avatar: 'JM',
        department: 'Sales',
        lastLogin: '2 weeks ago'
      },
      {
        id: 5,
        name: 'Olivia Brown',
        email: 'olivia.brown@company.com',
        role: 'Developer',
        status: 'Active',
        joinDate: '2024-01-25',
        avatar: 'OB',
        department: 'Engineering',
        lastLogin: '3 hours ago'
      },
      {
        id: 6,
        name: 'Robert Taylor',
        email: 'robert.taylor@company.com',
        role: 'Manager',
        status: 'Active',
        joinDate: '2023-09-12',
        avatar: 'RT',
        department: 'Operations',
        lastLogin: '1 hour ago'
      },
      {
        id: 7,
        name: 'Sophia Anderson',
        email: 'sophia.anderson@company.com',
        role: 'User',
        status: 'Pending',
        joinDate: '2024-11-20',
        avatar: 'SA',
        department: 'HR',
        lastLogin: 'Never'
      },
      {
        id: 8,
        name: 'William Garcia',
        email: 'william.garcia@company.com',
        role: 'Developer',
        status: 'Active',
        joinDate: '2024-04-18',
        avatar: 'WG',
        department: 'Engineering',
        lastLogin: '4 hours ago'
      },
      {
        id: 9,
        name: 'Isabella Moore',
        email: 'isabella.moore@company.com',
        role: 'Admin',
        status: 'Active',
        joinDate: '2023-08-30',
        avatar: 'IM',
        department: 'IT',
        lastLogin: '30 minutes ago'
      },
      {
        id: 10,
        name: 'David Lee',
        email: 'david.lee@company.com',
        role: 'User',
        status: 'Inactive',
        joinDate: '2024-05-22',
        avatar: 'DL',
        department: 'Finance',
        lastLogin: '1 month ago'
      }
    ];
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      case 'Pending':
        return 'warn';
      default:
        return 'info';
    }
  }

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      'Admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Developer': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'User': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return classes[role] || classes['User'];
  }

  editUser(user: User) {
    console.log('Edit user:', user);
    // Implement edit functionality
  }

  deleteUser(user: User) {
    console.log('Delete user:', user);
    // Implement delete functionality
  }

  viewUser(user: User) {
    console.log('View user:', user);
    // Implement view functionality
  }

  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }
}

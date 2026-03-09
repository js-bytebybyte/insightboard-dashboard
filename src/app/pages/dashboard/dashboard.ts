import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

// primeng module imports
import { CardModule } from 'primeng/card';


import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexTooltip,
  ApexPlotOptions
} from 'ng-apexcharts';

interface KPI {
  value: string;
  change: string;
  description: string;
}

interface Transaction {
  id: string;
  customer: string;
  customerInitials: string;
  email: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // KPI Data
  kpis = {
    revenue: {
      value: '$45,231',
      change: '+12.5%',
      description: 'Compared to last month'
    },
    users: {
      value: '8,234',
      change: '+8.2%',
      description: 'Active users this month'
    },
    orders: {
      value: '1,543',
      change: '+15.3%',
      description: 'Total orders processed'
    },
    conversion: {
      value: '3.24%',
      change: '-2.1%',
      description: 'Average conversion rate'
    }
  };

  // Revenue Chart Configuration
  revenueChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    colors: string[];
    dataLabels: ApexDataLabels;
    fill: ApexFill;
    grid: ApexGrid;
    tooltip: ApexTooltip;
  } = {
    series: [
      {
        name: 'Revenue',
        data: [31000, 40000, 28000, 51000, 42000, 45231]
      }
    ],
    chart: {
      height: 300,
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#8b5cf6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val: number) => '$' + val.toLocaleString()
      }
    }
  };

  // Category Chart Configuration
  categoryChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    plotOptions: ApexPlotOptions;
    colors: string[];
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
  } = {
    series: [
      {
        name: 'Sales',
        data: [44, 55, 41, 67, 22, 43, 21]
      }
    ],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'],
    xaxis: {
      categories: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys', 'Food'],
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    }
  };

  // Transactions Data
  transactions: Transaction[] = [
    {
      id: '#TXN-2301',
      customer: 'Sarah Johnson',
      customerInitials: 'SJ',
      email: 'sarah.j@example.com',
      date: 'Nov 23, 2025',
      amount: '$458.00',
      status: 'Completed'
    },
    {
      id: '#TXN-2302',
      customer: 'Michael Chen',
      customerInitials: 'MC',
      email: 'michael.c@example.com',
      date: 'Nov 23, 2025',
      amount: '$892.50',
      status: 'Completed'
    },
    {
      id: '#TXN-2303',
      customer: 'Emma Wilson',
      customerInitials: 'EW',
      email: 'emma.w@example.com',
      date: 'Nov 22, 2025',
      amount: '$125.00',
      status: 'Pending'
    },
    {
      id: '#TXN-2304',
      customer: 'James Martinez',
      customerInitials: 'JM',
      email: 'james.m@example.com',
      date: 'Nov 22, 2025',
      amount: '$649.99',
      status: 'Completed'
    },
    {
      id: '#TXN-2305',
      customer: 'Olivia Brown',
      customerInitials: 'OB',
      email: 'olivia.b@example.com',
      date: 'Nov 21, 2025',
      amount: '$234.00',
      status: 'Failed'
    }
  ];

  // Helper method for status badge styling
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return classes[status] || '';
  }
}

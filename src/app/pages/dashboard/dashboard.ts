import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

// Services
import { CsvParserService } from '../../services/csv-parser.service';

// Data
import { sampleTransactions } from '../../sample-data/transactions.sample';
import type { Transaction } from '../../models/transactions';

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

interface CategoryTotals {
  category: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private csvParserService = inject(CsvParserService);

  // The list of transactions lives on the component, so the template can see it.
  // It's a signal: when we call .set(), everything that reads it (table, chart, total) updates.
  transactions = signal<Transaction[]>(sampleTransactions);

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



  // I need a total amount per category within transactions

  /* 
    issue: transactions contains multiple times the same category
    so i would like to create a structure that will retrieve the unique categories (no duplicates)
    and each time the category is found in transaction it will sum the amounts 
    result is an object array with properties
      - category:
      - total 
  */
  getTotalPerCategory(transactions: Transaction[]): CategoryTotals[] {
    const totals: { [key: string]: number } = {};

    // Loop through each transaction
    for (const transaction of transactions) {
      // If category already exists, add to total; otherwise, set initial total
      if (totals[transaction.category]) {
        totals[transaction.category] += transaction.amount;
      } else {
        totals[transaction.category] = transaction.amount;
      }
    }

    // Create the result array
    const result: CategoryTotals[] = [];
    for (const category in totals) {
      result.push({ category, total: totals[category] });
    }
    return result;
  }
  
  


  // Category Chart Configuration
  // computed() re-runs automatically whenever this.transactions() changes,
  // so we no longer need a manual "updateCharts()" step after an upload.
  categoryChartOptions = computed<{
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    plotOptions: ApexPlotOptions;
    colors: string[];
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
  }>(() => {
    const totals = this.getTotalPerCategory(this.transactions());
    return {
      series: [
        {
          name: 'Totals',
          data: totals.map((c) => c.total)
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
        enabled: true
      },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'],
      xaxis: {
        categories: totals.map((c) => c.category),
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
  });

  // Helper method for status badge styling
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return classes[status] || '';
  }

  // Helper method to display total Amount of Recurring Expenses
  getRecurringExpensesAmount(): string {
    const totalAmount = this.transactions().reduce((prev, t) => prev + t.amount, 0);
    return totalAmount.toFixed(2);
  }

  /**
   * Handle CSV file upload from input
   * @param event - File input change event
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      alert('Please select a valid CSV file');
      return;
    }

    // Read file as text
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result === 'string') {
        this.parseAndMergeTransactions(e.target.result);
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading the file. Please try again.');
    };

    reader.readAsText(file);
  }

  /**
   * Parse CSV content and merge with existing transactions
   * @param csvContent - Raw CSV file content
   */
  private parseAndMergeTransactions(csvContent: string): void {
    try {
      // Parse CSV using the service
      const parsedTransactions = this.csvParserService.parseKbcCsv(csvContent);
      console.log('parseAndMergeTransactions', parsedTransactions);

      if (parsedTransactions.length === 0) {
        alert('No valid transactions found in the CSV file');
        return;
      }

      // Merge with existing transactions (avoid duplicates)
      const mergedTransactions = this.mergeDuplicates(
        [...this.transactions(), ...parsedTransactions]
      );

      // Update transactions (the chart, table and total follow automatically)
      this.transactions.set(mergedTransactions);

      // Log success
      console.log(`Successfully loaded ${parsedTransactions.length} transactions`);
      alert(`Successfully loaded ${parsedTransactions.length} transactions!`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing the CSV file. Please check the file format.');
    }
  }

  /**
   * Merge duplicate transactions based on date, amount, and recipient
   * @param transactions - Array of transactions to merge
   * @returns Array without duplicates
   */
  private mergeDuplicates(transactions: Transaction[]): Transaction[] {
    const seen = new Set<string>();
    const merged: Transaction[] = [];

    for (const transaction of transactions) {
      // Create a unique key based on date, amount, and recipient
      const key = `${transaction.date}-${transaction.amount}-${transaction.recipient}`;

      if (!seen.has(key)) {
        seen.add(key);
        merged.push(transaction);
      }
    }

    return merged;
  }
}

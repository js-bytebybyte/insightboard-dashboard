import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Primeng
import { TableModule } from 'primeng/table';

// Service 
import { TransactionService } from '../../service/mock';

// Domain
import { Transaction } from '../../domain/transactions';


@Component({
  selector: 'app-expenses',
  imports: [TableModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
  providers: [TransactionService]
})
export class Expenses implements OnInit{

  // initialize   
  transaction!: Transaction[];

  constructor(private transactionService: TransactionService ) {}

  ngOnInit() {
    this.transaction = this.transactionService.transaction;
  }


}

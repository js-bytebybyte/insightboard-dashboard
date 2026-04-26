import { Injectable } from '@angular/core';
import { Transaction } from '../../app/domain/transactions'


@Injectable({ providedIn: 'root' })
export class TransactionService {
  transaction: Transaction[] = [
        {
          id: '1',
          recipient: 'Albert-Elisabethlaan',
          category: 'Rent',
          notes: 'Payment via Jenny',
          date: '28/30/31th - End of the month',
          amount: 577.00,
          status: 'Completed'
        },
        {
          id: '2',
          recipient: 'Gas & Electriciteit',
          category: 'Utilities',
          notes: 'Payment via Jorina',
          date: '10th',
          amount: 60.00,
          status: 'Completed'
        },
        {
          id: '3',
          recipient: 'Vivaqua',
          category: 'Utilities',
          notes: 'Water',
          date: '14th',
          amount: 67.00,
          status: 'Pending'
        },
        {
          id: '4',
          recipient: 'Animo',
          category: 'Healthcare',
          notes: 'BSPORT S.A.S',
          date: '3th',
          amount: 209.00,
          status: 'Completed'
        },
        {
          id: '5',
          recipient: 'Netflix',
          category: 'Subscriptions',
          notes: 'Payment via Paypal',
          date: '1st',
          amount: 21.99,
          status: 'Failed'
        },
        {
          id: '6',
          recipient: 'Spotify',
          category: 'Subscriptions',
          notes: 'Payment via Paypal',
          date: '6th',
          amount: 17.99,
          status: 'Completed'
        },
        {
          id: '7',
          recipient: 'YouTube',
          category: 'Subscriptions',
          notes: 'Payment via Paypal',
          date: '28/30/31',
          amount: 25.99,
          status: 'Completed'
        },
        {
          id: '8',
          recipient: 'Google AI Plus',
          category: 'Subscriptions',
          notes: 'Payment via Paypal',
          date: '28/30/31',
          amount: 7.99,
          status: 'Completed'
        },
        {
          id: '9',
          recipient: 'Mobile Vikings',
          category: 'Subscriptions',
          notes: 'Payment for mama',
          date: '12th',
          amount: 29.00,
          status: 'Completed'
        },
        {
          id: '10',
          recipient: 'Mobile Vikings',
          category: 'Subscriptions',
          notes: 'Manual payment',
          date: 'NA',
          amount: 29.00,
          status: 'Pending'
        },
        {
          id: '11',
          recipient: 'Apple Services',
          category: 'Subscriptions',
          notes: 'iCloud+',
          date: '2nd',
          amount: 2.99,
          status: 'Pending'
        },
        {
          id: '12',
          recipient: 'Pricos SRI',
          category: 'Pension',
          notes: 'KBC Pensionsparen',
          date: '28/30/31',
          amount: 25.00,
          status: 'Pending'
        },
        {
          id: '13',
          recipient: 'Apple Services',
          category: 'Subscriptions',
          notes: 'Viki - Payment via Apple Services (App Store)',
          date: '30',
          amount: 4.99,
          status: 'Pending'
        },
        {
          id: '14',
          recipient: 'Bijdrage KBC-Basisrekening',
          category: 'Subscriptions',
          notes: 'Viki - Payment via Apple Services (App Store)',
          date: '28/30/31',
          amount: 2.90,
          status: 'Pending'
        },
    ];

};
import { Injectable } from '@angular/core';
import type { Transaction } from '../models/transactions';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  /**
   * Parse KBC bank statement CSV file
   * @param csvContent - The raw CSV file content as string
   * @returns Array of Transaction objects
   */
  parseKbcCsv(csvContent: string): Transaction[] {
    const lines = csvContent.split('\r'); // adjusted according to KBC export
    console.log(lines);
    const transactions: Transaction[] = [];
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        continue;
      }

      // Parse the CSV line
      const transaction = this.parseKbcLine(line, i);
      if (transaction) {
        transactions.push(transaction);
      }
    }

    return transactions;
  }

  /**
   * Parse a single line from KBC CSV
   * @param line - Single CSV line
   * @param lineNumber - Line number (for ID generation)
   * @returns Transaction object or null if invalid
   */
  private parseKbcLine(line: string, lineNumber: number): Transaction | null {
    try {
        // returns a string array of all the ; separated elements of 
      const columns = line.split(';');
      // console.log(columns.length); // --> depends on the export...

      // Check if line has enough columns --> JST??
    //   if (columns.length < 12) {
    //     return null;
    //   }
      // console.log('parse KBC line from service');
      // Extract relevant columns
      const date = columns[5]?.trim();                    // Column 5: Datum (DD/MM/YYYY)
      const description = columns[6]?.trim();             // Column 6: Omschrijving
      const bedrag = columns[8]?.trim();                  // Column 8: Bedrag
      const notes = columns[17]?.trim();                  // Column 18: Vrije mededeling

      // Validate date
      if (!date || !date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return null;
      }

      // Parse amount (replace comma with period)
      const amount = this.parseAmount(bedrag);
      if (amount === null) {
        return null;
      }

      // Determine status based on amount and description
      const status = this.determineStatus(amount, description);

      // Extract recipient from description
      const recipient = this.extractRecipient(description);

      // Extract category
      const category = this.extractCategory(description);

      return {
        id: lineNumber.toString(),
        recipient,
        category,
        notes: notes || '',
        date,
        amount: Math.abs(amount), // Store absolute value
        status
      };
    } catch (error) {
      console.error(`Error parsing line ${lineNumber}:`, error);
      return null;
    }
  }

  /**
   * Parse amount string (handles comma as decimal separator)
   * @param amountStr - Amount string (e.g., "-6,00")
   * @returns Parsed number or null if invalid
   */
  private parseAmount(amountStr: string): number | null {
    if (!amountStr) {
      return null;
    }

    // Replace comma with period for decimal separator
    const normalized = amountStr.replace(',', '.');
    const num = parseFloat(normalized);

    return isNaN(num) ? null : num;
  }

  /**
   * Extract recipient name from description
   * @param description - Transaction description
   * @returns Recipient name
   */
  private extractRecipient(description: string): string {
    if (!description) {
      return 'Unknown';
    }

    let recipient: string = '';
    // Look for common patterns in KBC bank statements
    if (description.startsWith('BETALING')){
        // console.log('TYPE = BETALING');

        const index = description.indexOf('UUR');
        const endIndex = description.indexOf('MET');
        // the vendor is at index + 4; U R SPACE 
        // if (index)
        //     console.log('index of uur exists:', description[index + 4]);
        // if (endIndex)
        //     console.log('endIndex for description that ends with betaling:', endIndex);
        if (index && endIndex){
            recipient = description.substring(index+4, endIndex);
            // console.log('the recipient: ', recipient);
        }
        else
            console.log('no END found');
    }
    else if (description.startsWith('EUROPESE DOMICILIERING')){ 
        // console.log('TYPE = EUROPESE DOMICILIERING');

        const keyword = 'SCHULDEISER     : '
        // console.log('keyword length for SCHULDEISER',keyword.length);
        // console.log('description for EUR DOM: ', description);

        const startIndex = description.indexOf(keyword) + keyword.length;
        const endIndex = description.indexOf('REF.');
        if (startIndex && endIndex){
            // console.log('index of SCHULDEISER: exists:', startIndex, 'start new word: ', description[startIndex]);
            recipient = description.substring(startIndex, endIndex).trim()  ;
            // console.log(recipient);
        }
    }
    else if (description.startsWith('INSTANT')){
        // console.log('TYPE = INSTANTOVERSCHRIJVING');

        const keyword = 'XXX'
        // console.log('keyword length for SCHULDEISER',keyword.length);
        // console.log('description for EUR DOM: ', description);

        const startIndex = description.indexOf(keyword) + keyword.length;
        const endIndex = description.indexOf('OM');
        if (startIndex && endIndex){
            // console.log('index of INSTANTOVERSCHRIJVING: exists:', startIndex, 'start new word: ', description[startIndex]);
            recipient = description.substring(startIndex, endIndex).trim()  ;
            // console.log(recipient);
        }
    }
    else if (description.startsWith('OVERSCHRIJVING') || description.startsWith('DOORLOPENDE BETALINGSOPDRACHT') ){  // DOORLOPENDE BETALINGSOPDRACHT
        // console.log('TYPE = NORMALE OVERSCHRIJVING');
        const keyword = 'BEBB '
        const startIndex = description.indexOf(keyword) + keyword.length;
        const endIndex = description.indexOf('\n');
        if (startIndex){
          // console.log('the full description:', description);
            // console.log('index OVERSCHRIJVING: exists:', startIndex, 'start new word: ', description[startIndex]);
            recipient = description.substring(startIndex).trim();
            // console.log(recipient);
        }
    }
    
        

    /* 
        Recipient is always mentionend as the first item on the PDF of the bank statement
        --> STRUCTURE: 
        1. Recipient
        2. via XXX /Rekeningnummer
            - if betaling -> vendor is mentioned after 'UUR' and before 'MET'
            - if INSTANTOVERSCHRIJVING: recipient after BIC 'XXX' and 
            - if EUROPESE DOMICILIERING  
            - if OVERSCHRIJVING 
    
    */
    /* const patterns = [
      /NAAR\s+([A-Z\s]+)\s+(?:BE|AT|DE|FR|NL)/,  // For transfers to accounts
      /VAN\s+([A-Z\s]+)\s+(?:BE|AT|DE|FR|NL)/,   // For transfers from accounts
      /SCHULDEISER\s*:\s*([A-Z\s]+?)\s+REF/,     // For domiciliering
      /BEGUNSTIGDE\s*:\s*([A-Z\s\-]+?)\s+(?:OM|KOFFIE|HUUR)/  // For beneficiary
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback: extract words between certain keywords
    const parts = description.split(/\s+/);
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'NAAR' || parts[i] === 'VAN') {
        // Return next 2-3 words as recipient
        const recipient = parts.slice(i + 1, i + 3).join(' ');
        if (recipient) {
          return recipient;
        }
      }
    } */
    if (recipient.length < 2 || recipient === '')
      recipient = 'Unknown';
    if (recipient === 'Unknown'){
      // console.log(' RECIPIENT UNKNOWN!', description);
      const pattern = /^(.+?)\s{2,}(\d{2}-\d{2})/;
      const match = description.match(pattern);

      if (match) {
        recipient = match[1];
        console.log(match[1]); // "PRICOS SRI"
        console.log(match[2]); // "30-03"
      }

    }
    // else
    console.log('THE RECIPIENT: ', recipient);

    return recipient;
  }

  /**
   * Extract category from description
   * @param description - Transaction description
   * @returns Category name
   */
  private extractCategory(description: string): string {
    if (!description) {
      return 'Other';
    }

    const lowerDesc = description.toLowerCase();

    // Define category keywords
    const categories: { [key: string]: string[] } = {
      'Rent': ['huur', 'loyer', 'landlord'],
      'Utilities': ['gas', 'electriciteit', 'vivaqua', 'water', 'energie'],
      'Subscriptions': ['netflix', 'spotify', 'paypal', 'apple', 'google', 'youtube', 'mobile vikings'],
      'Healthcare': ['animo', 'dokter', 'pharmacy', 'santé'],
      'Groceries': ['supermarket', 'aldi', 'carrefour', 'delhaize', 'migros'],
      'Dining': ['restaurant', 'café', 'rambo', 'burger', 'pizza', 'boulangerie'],
      'Transport': ['bpost', 'chronorace', 'taxi', 'uber', 'train'],
      'Pension': ['pension', 'épargne', 'sparen', 'pricos'],
      'Personal': ['viki', 'jorina', 'jenny', 'jolande', 'mama', 'rambo char'],
    };

    // Check each category
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          return category;
        }
      }
    }

    return 'Other';
  }

  /**
   * Determine transaction status
   * @param amount - Transaction amount
   * @param description - Transaction description
   * @returns Status
   */
  private determineStatus(amount: number, description: string): 'Completed' | 'Pending' | 'Failed' {
    /* const lowerDesc = (description || '').toLowerCase();

    // Check for pending indicators
    if (lowerDesc.includes('pending') || lowerDesc.includes('in process')) {
      return 'Pending';
    }

    // Check for failed indicators
    if (lowerDesc.includes('failed') || lowerDesc.includes('cancelled')) {
      return 'Failed';
    }
 */
    // Default to completed
    return 'Completed';
  }
}

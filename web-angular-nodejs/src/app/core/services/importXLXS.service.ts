import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ImportXlxsFile {
  importXLXSFile(file: File) {
    let data: any = [];
    return new Promise<any>((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr = e.target.result;

        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'array' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];

        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
        resolve(data);
      };

      reader.readAsArrayBuffer(file);
    });
  }
}

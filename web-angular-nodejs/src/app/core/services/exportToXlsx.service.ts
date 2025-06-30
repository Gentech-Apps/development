import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { FileSaverOptions } from 'file-saver';
import { FileSaverDirective, FileSaverService } from 'ngx-filesaver';
import { IExportQuestion } from '../interface/IExportQuestions';

@Injectable({
  providedIn: 'root',
})
export class ExportToXlsxService {
  options: FileSaverOptions = {
    autoBom: false,
  };
  constructor(private fileSaverService: FileSaverService) {}

  fileExtension = '.xlsx';

  exportExcel(jsonData: IExportQuestion[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, `${fileName}.xlsx`);
  }

  public saveExcelFile(buffer: any, fileName: string): void {
    const fileType = this.fileSaverService.genType(fileName);
    const data: Blob = new Blob([buffer], { type: fileType });
    this.fileSaverService.save(data, fileName, undefined, this.options);
  }
}

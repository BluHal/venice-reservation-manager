import { Injectable } from '@angular/core';

const pdfjsLib = require('pdfjs-dist/build/pdf.js');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

@Injectable({
  providedIn: 'root',
})
export class PdfConversionService {
  constructor() {}

  async convertToText(file: File): Promise<string> {
    const fileReader = new FileReader();
    const pdfData = await new Promise<any>((resolve, reject) => {
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(file);
    });

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const pdfPage = await pdf.getPage(pageNumber);
      const pdfPageText = await pdfPage.getTextContent();
      pdfPageText.items.forEach((item: any) => {
        text += item.str + ' ';
      });
    }

    return text;
  }
}

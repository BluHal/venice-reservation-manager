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

  async convertToImage(file: File): Promise<string> {
    const fileReader = new FileReader();
    const pdfData = await new Promise<any>((resolve, reject) => {
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(file);
    });

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    const pageNumber = 1;
    const pdfPage = await pdf.getPage(pageNumber);

    // Set the desired scale (1.0 for original size)
    const scale = 1;

    // Get the page's original dimensions
    const viewport = pdfPage.getViewport({ scale });

    // Create a canvas to render the PDF page as an image
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render the PDF page as an image on the canvas
    await pdfPage.render({ canvasContext: context, viewport }).promise;

    // Convert the canvas to a JPEG image
    const jpegImage = canvas.toDataURL("image/jpeg");

    // Save the JPEG image to a file
    const base64Data = jpegImage.replace(/^data:image\/jpeg;base64,/, "");

    return jpegImage;
  }
}

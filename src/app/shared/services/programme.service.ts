import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProgrammeService {
  constructor(private http: HttpClient) {}

  getProgrammeByDate(date: string) {
    const formData = new FormData();
    formData.append('date', date);
    formData.append('sede', 'All');
    formData.append('view_name', 'programma');
    formData.append('view_display_id', 'block');
    formData.append('view_args', '13418');
    formData.append('view_path', 'node/13418');

    return this.http.post(`/api?date=${date}&sede=All`, formData);
  }

  getEventsList(htmlString: string): void {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    var eventList = doc.getElementsByClassName('node-appuntamento-programma');
    const titles: string[] = [];
    for (let index in eventList) {
      const eventDoc = new DOMParser().parseFromString(
        eventList[index].innerHTML,
        'text/html'
      );
      const titleEl = eventDoc.getElementsByClassName('lb-title');
      titleEl.length > 0 ? titles.push(titleEl[0].innerHTML) : false;
    }
    console.log(titles);
  }
}

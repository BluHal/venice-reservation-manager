import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Injectable, importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from './environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/routes';
import { provideRouter } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideStorage(() => getStorage()),
      provideAuth(() => getAuth()),
      provideDatabase(() => getDatabase()),
      provideFirestore(() => getFirestore())
    ),
    provideAnimations(),
    provideRouter(routes),
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
  ],
}).catch((err) => console.error(err));

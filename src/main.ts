import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Injectable, importProvidersFrom, isDevMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/routes';
import { provideRouter } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { provideServiceWorker } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, provideFirebaseApp(() => initializeApp(environment.firebase)), provideStorage(() => getStorage()), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideFirestore(() => getFirestore())),
    provideAnimations(),
    provideRouter(routes),
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
}).catch((err) => console.error(err));

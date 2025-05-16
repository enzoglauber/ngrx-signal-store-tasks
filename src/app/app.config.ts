import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore(),
    provideHttpClient(withFetch()),
  ],
};

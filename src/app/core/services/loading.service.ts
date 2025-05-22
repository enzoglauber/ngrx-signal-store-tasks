import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = signal(false);
  
  startLoading(): void {
    this.updateLoadingState(true);
  }
  
  stopLoading(): void {
    this.updateLoadingState(false);
  }
  
  private updateLoadingState(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }
  
} 
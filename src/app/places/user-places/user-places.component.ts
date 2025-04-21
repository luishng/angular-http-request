import { Component, DestroyRef, inject, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  isFetching = signal(false)
  error = signal('')


  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef)

  places = this.placeService.loadedUserPlaces;

  ngOnInit(): void {
    this.isFetching.set(true)
    const subscription = this.placeService.loadUserPlaces().subscribe({
      error: (error: Error) => {
        this.error.set(error.message)
      },
      complete: () => {
        this.isFetching.set(false)
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placeService.removeUserPlace(selectedPlace).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

}

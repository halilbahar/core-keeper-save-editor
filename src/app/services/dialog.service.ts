import { ComponentType, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>(component: ComponentType<T>) {
    // Globally centered position strategy
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    // Create the overlay with customizable options
    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop'
    });

    const dialogRef = new DialogRef(overlayRef);
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: DialogRef, useValue: dialogRef }]
    });

    // Attach component portal to the overlay
    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    // Create dialogRef to return
    return dialogRef;
  }
}

export class DialogRef {
  private afterClosedSubject = new Subject<any>();

  constructor(private overlayRef: OverlayRef) {}

  /**
   * Closes the overlay. You can optionally provide a result.
   */
  public close(result?: any) {
    this.overlayRef.dispose();
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  /**
   * An Observable that notifies when the overlay has closed
   */
  public afterClosed(): Observable<any> {
    return this.afterClosedSubject.asObservable();
  }
}

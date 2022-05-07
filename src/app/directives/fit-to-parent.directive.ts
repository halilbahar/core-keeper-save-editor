import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appFitToParent]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[style.position]': '"relative"',
    '[style.left]': '"50%"',
    '[style.top]': '"50%"',
    '[style.transform-origin]': '"center center"'
  }
})
export class FitToParentDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.scale();
  }

  @HostListener('window:resize', ['$event'])
  onResize(_) {
    this.scale();
  }

  private scale(): void {
    Promise.resolve().then(() => {
      const element = this.elementRef.nativeElement as HTMLElement;
      const parent = element.parentElement;
  
      const scale = Math.min(
        (parent.clientWidth * 0.8) / element.clientWidth,
        (parent.clientHeight * 0.8) / element.clientHeight
      );
  
      element.style.transform = `translate(-50%, -50%) scale(${scale})`;
    })
  }
}

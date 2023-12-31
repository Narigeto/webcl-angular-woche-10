import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-round-eye',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './round-eye.component.html',
  styleUrl: './round-eye.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RoundEyeComponent implements AfterViewInit {
  private thisElement: HTMLElement;

  private leftListener: ((evt: MouseEvent) => void) | undefined;
  private rightListener: ((evt: MouseEvent) => void) | undefined;

  private eyeView = (id: string) => `
  <svg id="${id}" viewBox="0 0 120 120">
    <filter id="shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
      <feOffset       dx="0" dy="8" />
      <feColorMatrix  type="matrix"
                      values="0 0 0 0  0
                              0 0 0 0  0
                              0 0 0 0  0
                              0 0 0 .5 0"/>
      <feBlend        in="SourceGraphic" mode="normal"/>
    </filter>

    <radialGradient id="gradient1" gradientUnits="objectBoundingBox" cx="50%" cy="50%" r="50%">
      <stop offset= "38%" stop-color="#000000" stop-opacity="1" />
      <stop offset= "46%" stop-color="#073F80" stop-opacity="1" />
      <stop offset= "90%" stop-color="#8EC0DD" stop-opacity="1" />
      <stop offset="100%" stop-color="#2F3A46" stop-opacity="1" />
    </radialGradient>
    <g id="${id}_iris">
      <ellipse cx="60" cy="60" rx="30" ry="30" opacity="1" fill="url(#gradient1)" />
      <ellipse cx="50" cy="50" rx="7"  ry="7"  opacity="1" fill="#FFFFFF" fill-opacity="0.8"/>
    </g>
    <g id="${id}_openLids">
      <path d="M0 60 A60,60 0 0,1 120,60 A60,30 0 0,0 0,60 Z" opacity="1" fill="#FDDC99" fill-opacity="1" filter="url(#shadow)" />
      <path d="M0 60 A60,60 0 0,0 120,60 A60,40 0 0,1 0,60 Z" opacity="1" fill="#F4CB76" fill-opacity="1" />
    </g>
    <g id="${id}_closeLid">
      <path d="M0 60 A60,60 0 0,1 120,60 A60,40 0 0,1 0,60 Z" opacity="1" fill="#FDDC99" fill-opacity="1" />
    </g>
  </svg>
  `;

  constructor(private elementRef: ElementRef){
    this.thisElement = elementRef.nativeElement;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(evt: MouseEvent): void {
    this.leftListener && this.leftListener(evt);
    this.rightListener && this.rightListener(evt);
  }

  ngAfterViewInit(): void {
    this.thisElement.innerHTML = this.eyeView('leftEye') + this.eyeView('rightEye');

    const v = 14; // versatz - Abstand des Pupillenzentrums vom Augenzentrum in SVG units

    this.leftListener = this.eyeBinding('#leftEye');
    this.rightListener = this.eyeBinding('#rightEye');
  }

  eyeBinding(eyeId: string): (evt: MouseEvent) => void {
    const thisElement = this.elementRef.nativeElement;
    const rect = thisElement.querySelectorAll(eyeId + "_iris ellipse")[0].getBoundingClientRect();
    const iris = thisElement.querySelector(eyeId + "_iris") as HTMLElement;
    const closeLidLayer = thisElement.querySelector(eyeId + "_closeLid") as HTMLElement;
    const eye = thisElement.querySelector(eyeId) as HTMLElement;

    closeLidLayer.style.opacity = '0';

    setInterval(() => {
      if (closeLidLayer.style.opacity === '1') return; // do not close and then open if already closed
      closeLidLayer.style.opacity = '1';
      setTimeout(() => closeLidLayer.style.opacity = '0', 300)
    }, 7 * 1000);

    const xo = rect.x + rect.width / 2;  // x-origin
    const yo = rect.y + rect.height / 2; // y-origin

    eye.onclick = evt =>
      closeLidLayer.style.opacity = (closeLidLayer.style.opacity === '1') ? '0' : '1';

    return evt => {
      const xm = evt.clientX - xo; // the normalized x/y coords to work with
      const ym = evt.clientY - yo;

      const xmax = rect.width / 1.5;
      const ymax = rect.height / 2;

      const widestFocus = 400; // when x is so far away, the eye is maximal extended
      const scaledX = xm * (xmax / widestFocus);
      let xe = xm > 0
        ? Math.min(xmax, scaledX)
        : Math.max(-xmax, scaledX);
      const scaledY = ym * (ymax / widestFocus);
      let ye = ym > 0
        ? Math.min(ymax, scaledY)
        : Math.max(-ymax, scaledY);
      if (xe * xe + ye * ye > xmax * ymax) {
        xe *= 0.9;
        ye *= 0.9;
      }
      iris.style.transform = `translateX(${xe}px) translateY(${ye}px)`;
    }
  }
}
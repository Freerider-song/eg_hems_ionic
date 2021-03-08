/*
import {ElementRef, Directive} from '@angular/core';

@Directive({
  selector: '[elastic]'
})
export class Elastic {

  constructor(public element:ElementRef){
    this.element = element;
  }

  ngAfterViewInit(){
    this.element.nativeElement.querySelector("textarea").style.height = "100%";
  }

}
*/

// An autoresize directive that works with ion-textarea in Ionic 2
// Usage example: <ion-textarea autoresize [(ngModel)]="body"></ion-textarea>
// Based on https://www.npmjs.com/package/angular2-autosize
/*
import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
	selector: "ion-textarea[autoresize]" // Attribute selector
})
export class Autoresize {

	@HostListener("input", ["$event.target"])
	onInput(textArea: HTMLTextAreaElement): void {
		this.adjust();
	}
	constructor(public element: ElementRef) {
	}
	ngOnInit(): void {
		this.adjust();
	}
	adjust(): void {
		let ta = this.element.nativeElement.querySelector("textarea");
		ta.style.overflow = "hidden";
		ta.style.height = "auto";
		ta.style.height = ta.scrollHeight + "px";
	}

}*/

import {ElementRef, HostListener, Directive, OnInit} from '@angular/core';

@Directive({
  selector: 'ion-textarea[autosize]'
})

export class Autosize implements OnInit {
  @HostListener('input', ['$event.target'])
  onInput(textArea:HTMLTextAreaElement):void {
    this.adjust();
  }

  constructor(public element:ElementRef) {
  }

  ngOnInit():void {
    setTimeout(() => this.adjust(), 0);
  }

  adjust():void {
    let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + "px";
  }
}
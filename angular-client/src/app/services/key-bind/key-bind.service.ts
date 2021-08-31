import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyBindService {

  keyBinds: any[] = [];

  constructor() { }

  setKeyBind(type: string, listener: (this: Document, ev: KeyboardEvent) => any, options?: boolean | AddEventListenerOptions) {
    document.addEventListener(type, listener, options); 
    this.keyBinds.push({type, listener});
  }

  removeKeyBinds() {
    this.keyBinds.forEach(keyBind => {
      document.removeEventListener(keyBind.type, keyBind.listener, keyBind.options);
    });
    this.keyBinds = [];
  }
}

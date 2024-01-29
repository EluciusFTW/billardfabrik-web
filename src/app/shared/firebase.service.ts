import { Injectable, inject } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";

export abstract class FirebaseService {
  protected readonly db = inject(AngularFireDatabase);
}

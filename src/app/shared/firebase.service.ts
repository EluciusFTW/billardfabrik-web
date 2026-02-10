import { Injectable, inject } from "@angular/core";
import { Database } from "@angular/fire/database";

@Injectable()
export abstract class FirebaseService {
  protected readonly db = inject(Database);
}

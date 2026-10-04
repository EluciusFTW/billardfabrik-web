import { inject } from "@angular/core";
import { Database } from "@angular/fire/database";

export abstract class FirebaseService {
  protected readonly db = inject(Database);
}

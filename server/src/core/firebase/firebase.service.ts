import {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} from "@/shared/constants/env.const";
import { Global, Injectable, Module } from "@nestjs/common";

import * as firebaseAdmin from "firebase-admin";

@Injectable()
export class FirebaseService {
  private _firebaseApp: firebaseAdmin.app.App;

  constructor() {
    this._firebaseApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
  }

  async verifyToken(token: string) {
    return this._firebaseApp.auth().verifyIdToken(token);
  }
}

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}

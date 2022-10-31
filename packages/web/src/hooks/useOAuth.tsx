import { getAuth, signInWithPopup } from "firebase/auth";
import {
  firebaseApp,
  githubAuthProvider,
  googleAuthProvider,
} from "../config/firebase";
import { getOrCreateUser } from "../api/user";

export const useGithubOAuth = () => async () => {
  const auth = getAuth(firebaseApp);
  const authnedUser = await signInWithPopup(auth, githubAuthProvider);

  if (authnedUser) {
    await getOrCreateUser(authnedUser);
  }
};

export const useGoogleOAuth = () => async () => {
  const auth = getAuth(firebaseApp);
  const authnedUser = await signInWithPopup(auth, googleAuthProvider);

  if (authnedUser) {
    await getOrCreateUser(authnedUser);
  }
};

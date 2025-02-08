import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};
const googleProvider = new GoogleAuthProvider();

// authProvider
export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// register a user
	const registerUser = async (email, password) => {
		return await createUserWithEmailAndPassword(auth, email, password);
	};

	// login a user
	const loginUser = async (email, password) => {
		return await signInWithEmailAndPassword(auth, email, password);
	};

	// sing up with google
	const signUpWithGoogle = async () => {
		return await signInWithPopup(auth, googleProvider);
	};

	//logout the user
	const logout = () => {
        localStorage.removeItem('token'); //admin
		return signOut(auth);
	};


	// manage the user
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);

			if (user) {
				const { email, displayName, photoURL } = user;
				const userData = {
					email,
					username: displayName,
					photo: photoURL,
				};
			}
		});

		return () => unsubscribe();
	}, []);

	const value = {
		currentUser,
		loading,
		registerUser,
		loginUser,
		signUpWithGoogle,
		logout,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

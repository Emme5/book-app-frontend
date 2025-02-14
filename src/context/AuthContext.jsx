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

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const registerUser = async (email, password, role = 'user') => {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		// เพิ่มการจัดการ role ที่นี่
		return userCredential;
	};

	const loginUser = async (email, password) => {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		
		// สำหรับ admin login
		if (email === 'admin@example.com') {
			localStorage.setItem('token', await userCredential.user.getIdToken());
			localStorage.setItem('role', 'admin');
		}
		
		return userCredential;
	};

	// sing up with google
	const signUpWithGoogle = async () => {
		return await signInWithPopup(auth, googleProvider);
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('role');
		return signOut(auth);
	};

	// manage the user
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const { email, displayName, photoURL } = user;
				
				// เพิ่มการกำหนด role
				const role = email === 'admin@example.com' ? 'admin' : 'user';
				
				const userData = {
					email,
					username: displayName,
					photo: photoURL,
					role: role
				};

				setCurrentUser({
					...user,
					...userData
				});
			} else {
				setCurrentUser(null);
			}
			
			setLoading(false);
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
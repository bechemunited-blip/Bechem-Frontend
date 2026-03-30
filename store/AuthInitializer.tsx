"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { verifyAndFetchProfile, setLoadingComplete } from "./slices/authSlice";

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const storedToken = localStorage.getItem("bufc_token");
        if (storedToken) {
            dispatch(verifyAndFetchProfile(storedToken));
        } else {
            dispatch(setLoadingComplete());
        }
    }, [dispatch]);

    return null;
}

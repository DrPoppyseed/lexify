import { useContext } from "react";
import { AppStateContext } from "../contexts/AppStateContext";

export const useAppState = () => useContext(AppStateContext);

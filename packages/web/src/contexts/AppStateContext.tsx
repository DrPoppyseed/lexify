import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";

type AppStateContextType = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<
    SetStateAction<AppStateContextType["isDrawerOpen"]>
  >;
};

const appStateContextDefault: AppStateContextType = {
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
};

const AppStateContext = createContext<AppStateContextType>(
  appStateContextDefault
);

const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(
    appStateContextDefault.isDrawerOpen
  );

  const memoizedValues = useMemo(
    () => ({
      isDrawerOpen,
      setIsDrawerOpen,
    }),
    [isDrawerOpen]
  );

  return (
    <AppStateContext.Provider value={memoizedValues}>
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext, AppStateProvider };

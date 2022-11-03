import { AppBar, Grid, styled } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Header from "../components/Header";
import Drawer from "../components/Drawer/Drawer";
import CollectionEditor from "../components/CollectionEditor";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useGetCollections } from "../hooks/useCollection";
import VocabCardsContainer from "../components/VocabCardsContainer";
import { useAppState } from "../hooks/useAppState";

const Home = () => {
  const { isDrawerOpen } = useAppState();
  const params = useParams();
  const { getItemFromLocalStorage, setItemToLocalStorage } = useLocalStorage();
  const { data } = useGetCollections();
  const navigate = useNavigate();

  useEffect(() => {
    // try to retrieve latest accessed collection from localStorage if collection id is not specified
    if (!params?.id) {
      const lastAccessedCollectionId = getItemFromLocalStorage(
        "latestAccessedCollectionId"
      );
      if (lastAccessedCollectionId) {
        navigate(`/${lastAccessedCollectionId}`);
      } else {
        console.log("TODO: just create a new collection");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const collectionData = useMemo(
    () =>
      data && params?.id ? data.find((col) => col.id === params.id) : null,
    [data, params]
  );

  return (
    <CollectionsBase>
      <HeaderWrapper
        position="fixed"
        elevation={0}
        isDrawerOpen={isDrawerOpen}
        drawerWidth={30}
      >
        <Header />
      </HeaderWrapper>
      <Drawer collections={data} />
      <BodyWrapper isDrawerOpen={isDrawerOpen} drawerWidth={30}>
        {collectionData && params?.id && (
          <>
            {/*  header */}
            <CollectionEditorWrapper container>
              <Grid item xs={1} />
              <Grid item xs={10}>
                <CollectionEditor {...collectionData} id={params.id} />
              </Grid>
              <Grid item xs={1} />
            </CollectionEditorWrapper>

            {/*  body */}
            <VocabCardsContainer collectionId={params.id} />
          </>
        )}
      </BodyWrapper>
    </CollectionsBase>
  );
};

const CollectionsBase = styled("div")`
  height: 100%;
  display: flex;
`;

const HeaderWrapper = styled(AppBar, {
  shouldForwardProp: (props) =>
    props !== "isDrawerOpen" && props !== "drawerWidth",
})<{ isDrawerOpen: boolean; drawerWidth: number }>`
  background-color: transparent;
  transition: ${({ theme }) =>
    theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })};
  ${({ theme, isDrawerOpen, drawerWidth }) =>
    isDrawerOpen && {
      width: `calc(100% - ${theme.spacing(drawerWidth)})`,
      marginLeft: theme.spacing(drawerWidth),
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }};
`;

const BodyWrapper = styled("div", {
  shouldForwardProp: (props) =>
    props !== "isDrawerOpen" && props !== "drawerWidth",
})<{ isDrawerOpen: boolean; drawerWidth: number }>`
  margin-top: ${({ theme }) => theme.spacing(8)};
  margin-left: -${({ theme, drawerWidth }) => theme.spacing(drawerWidth)};
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(4)};

  grid-template-rows: fit-content(100%) fit-content(100%);
  row-gap: ${({ theme }) => theme.spacing(4)};
  display: grid;

  transition: ${({ theme }) =>
    theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })};
  ${({ theme, isDrawerOpen }) =>
    isDrawerOpen && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }}
`;

const CollectionEditorWrapper = styled(Grid)`
  height: fit-content;
`;
export default Home;

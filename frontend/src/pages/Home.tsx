import { AppBar, Grid, styled } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import VocabCard from "../components/VocabCard/VocabCard";
import AddVocabWordCard from "../components/VocabCard/AddVocabWordCard";
import { vocabWordsState } from "../state/vocabWordsState";
import { isShakingState } from "../state/vocabCardState";
import Header from "../components/Header";
import { isDrawerOpenState } from "../state/pageState";
import Drawer from "../components/Drawer/Drawer";
import CollectionEditor from "../components/CollectionEditor/CollectionEditor";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { currentCollectionState } from "../state/collectionsState";

const Home = () => {
  const vocabWords = useRecoilValue(vocabWordsState);
  const params = useParams();
  const { getItemFromLocalStorage } = useLocalStorage();
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);
  const [isShaking, setIsShaking] = useRecoilState(isShakingState);
  const [currentCollection, setCurrentCollection] = useRecoilState(
    currentCollectionState
  );

  const drawerWidth = 30;

  useEffect(() => {
    console.log("params: ", params);
    // try to retrieve latest accessed collection from localStorage if collection id is not specified
    if (!params?.id) {
      const lastAccessedCollectionId = getItemFromLocalStorage(
        "latestAccessedCollectionId"
      );
      if (lastAccessedCollectionId && !currentCollection) {
        setCurrentCollection(lastAccessedCollectionId);
      }
    }
  }, [params]);

  return (
    <CollectionsBase
      onClick={() => {
        if (isShaking) {
          setIsShaking(false);
        }
      }}
    >
      <HeaderWrapper
        position="fixed"
        elevation={0}
        isDrawerOpen={isDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <Header />
      </HeaderWrapper>
      <Drawer width={drawerWidth} />
      <BodyWrapper isDrawerOpen={isDrawerOpen} drawerWidth={drawerWidth}>
        {!currentCollection && !params.id ? (
          <div>id</div>
        ) : (
          <>
            {/*  header */}
            <CollectionEditorWrapper xs={12} container>
              <Grid item xs={1} />
              <Grid item xs={10}>
                <CollectionEditor
                  id={params.id || (currentCollection as string)}
                />
              </Grid>
              <Grid item xs={1} />
            </CollectionEditorWrapper>

            {/*  body */}
            <Grid xs={12} container>
              <Grid item xs={1} />
              <Grid item xs={10} container spacing={2}>
                {vocabWords.map((id) => (
                  <Grid key={id} item xs={12} md={6} xl={4}>
                    <VocabCard id={id} />
                  </Grid>
                ))}
                <Grid item xs={12} md={6} xl={4}>
                  <AddVocabWordCard />
                </Grid>
              </Grid>
              <Grid item xs={1} />
            </Grid>
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
  background-color: #fffcf7;
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

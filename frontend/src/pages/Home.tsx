import { AppBar, Grid, styled } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import VocabCard from "../components/VocabCard/VocabCard";
import AddVocabWordCard from "../components/AddVocabWordCard";
import { vocabWordsState } from "../state/vocabWordsState";
import { isShakingState } from "../state/vocabCardState";
import Header from "../components/Header";
import { isDrawerOpenState } from "../state/pageState";
import Drawer from "../components/Drawer";

const Home = () => {
  const vocabWords = useRecoilValue(vocabWordsState);
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);
  const [isShaking, setIsShaking] = useRecoilState(isShakingState);

  const drawerWidth = 30;

  return (
    <HomeBase
      onClick={() => {
        if (isShaking) {
          setIsShaking(false);
        }
      }}
    >
      <HeaderWrapper
        position="fixed"
        color="inherit"
        elevation={0}
        isDrawerOpen={isDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <Header />
      </HeaderWrapper>
      <Drawer width={drawerWidth} />
      <BodyWrapper
        isDrawerOpen={isDrawerOpen}
        drawerWidth={drawerWidth}
        alignItems="flex-start"
        container
      >
        {/*  body */}
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
      </BodyWrapper>
    </HomeBase>
  );
};

const HomeBase = styled("div")`
  height: 100%;
  display: flex;
`;

const HeaderWrapper = styled(AppBar, {
  shouldForwardProp: (props) =>
    props !== "isDrawerOpen" && props !== "drawerWidth",
})<{ isDrawerOpen: boolean; drawerWidth: number }>`
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

const BodyWrapper = styled(Grid, {
  shouldForwardProp: (props) =>
    props !== "isDrawerOpen" && props !== "drawerWidth",
})<{ isDrawerOpen: boolean; drawerWidth: number }>`
  margin-top: ${({ theme }) => theme.spacing(8)};
  margin-left: -${({ theme, drawerWidth }) => theme.spacing(drawerWidth)};
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(4)};
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

export default Home;

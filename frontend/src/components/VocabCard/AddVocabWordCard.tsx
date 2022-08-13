import {
  Card as MuiCard,
  CardActionArea as MuiCardActionArea,
  styled,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useCreateVocabWord } from "../../state/vocabWordsState";

const AddVocabWordCard = () => {
  const createVocabWord = useCreateVocabWord();

  return (
    <Card
      elevation={0}
      onClick={() =>
        createVocabWord({
          word: "",
          definition: "",
        })
      }
    >
      <CardActionArea>
        <Add fontSize="large" color="disabled" />
      </CardActionArea>
    </Card>
  );
};

const Card = styled(MuiCard)`
  height: ${(props) => props.theme.spacing(16)};
`;

const CardActionArea = styled(MuiCardActionArea)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default AddVocabWordCard;

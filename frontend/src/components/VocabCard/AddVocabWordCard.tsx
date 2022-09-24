import {
  Card as MuiCard,
  CardActionArea as MuiCardActionArea,
  styled,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { FC } from "react";
import { useCreateVocabWord } from "../../hooks/useVocabWord";

const AddVocabWordCard: FC<{ collectionId: string }> = ({ collectionId }) => {
  const { createVocabWord } = useCreateVocabWord();

  return (
    <Card elevation={0} onClick={() => createVocabWord(collectionId)}>
      <CardActionArea>
        <Add fontSize="large" color="disabled" />
      </CardActionArea>
    </Card>
  );
};

const Card = styled(MuiCard)`
  height: ${(p) => p.theme.spacing(16)};
  background-color: #fffcf7;
`;

const CardActionArea = styled(MuiCardActionArea)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default AddVocabWordCard;

import { Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import React from "react";
import { Delete, Edit } from "@mui/icons-material";

interface IProps {
  imgUrl?: string;
  index?: number;
  onEdit: () => void;
  onDelete?: () => void;
  onNavigate: () => void;
  title: string;

  [p: string]: any;
}

function CheckListCard(props: IProps) {
  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea onClick={props.onNavigate}>
        <CardMedia component="img" sx={{ width: "30%" }} image={props.imgUrl} alt={`check-list-${props.index}`} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton onClick={props.onEdit} size="small" color="primary">
          <Edit />
        </IconButton>
        <IconButton onClick={props.onDelete} size="small" color="error">
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default CheckListCard;

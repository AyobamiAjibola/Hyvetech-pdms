import * as React from "react";
import Radio, { radioClasses } from "@mui/joy/Radio";
import { CssVarsProvider, RadioGroup } from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import { IImageButtonData } from "@app-interfaces";
import { CloseOutlined } from "@mui/icons-material";

interface IProps {
  options: IImageButtonData[];
  onDelete?: (id: any) => void;
  onView?: (id: any) => void;
}

export default function CustomRadioIconField(props: IProps) {
  return (
    <CssVarsProvider>
      <RadioGroup
        aria-label="platform"
        defaultValue="Website"
        overlay
        name="platform"
        sx={{
          flexDirection: "row",
          gap: 2,
          [`& .${radioClasses.checked}`]: {
            [`& .${radioClasses.action}`]: {
              inset: -1,
              border: "3px solid",
              borderColor: "primary.500",
            },
          },
          [`& .${radioClasses.radio}`]: {
            display: "contents",
            "& > svg": {
              zIndex: 2,
              position: "absolute",
              top: "-8px",
              right: "-8px",
              bgcolor: "background.body",
              borderRadius: "50%",
            },
          },
        }}
      >
        {props.options.map((option, index) => (
          <Sheet
            key={index}
            variant="outlined"
            sx={{
              borderRadius: "md",
              bgcolor: "background.level1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              minWidth: 60,
              width: "100%",
              minHeight: 60,
            }}
          >
            <Radio
              id={option.id}
              value={option.title}
              onClick={() => (props.onView ? props.onView(option.id) : null)}
              checkedIcon={
                <CloseOutlined
                  onClick={() =>
                    props.onDelete ? props.onDelete(option.id) : null
                  }
                />
              }
            />
            <img src={option.url} width="50%" alt={option.title} />
          </Sheet>
        ))}
      </RadioGroup>
    </CssVarsProvider>
  );
}
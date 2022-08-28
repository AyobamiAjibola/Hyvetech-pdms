import React, { memo, useContext } from "react";
import { Button } from "@mui/material";

import morning from "../../../assets/images/morning.png";
import sun from "../../../assets/images/sun.png";
import { AppContext } from "../../../context/AppContextProvider";
import useAppSelector from "../../../hooks/useAppSelector";
import { AppContextProperties } from "@app-interfaces";

interface Props {
  handleChange: any;
  slot: string;
}

function TimeSlot({ handleChange, slot }: Props) {
  const timeSlotReducer = useAppSelector((state) => state.timeSlotReducer);

  const { checkedSlot } = useContext(AppContext) as AppContextProperties;

  return (
    <div className="radio-container">
      {timeSlotReducer.slots.map((value: any, index: number) => {
        return (
          <div className="radio-btn" key={index}>
            <input
              disabled={false === value.available}
              type="radio"
              value={value.time}
              name="time"
              id={`${value.time}`}
              onChange={handleChange}
              checked={checkedSlot && value.time === slot}
            />

            <Button
              disabled={!value.available}
              className={!value.available ? "disabled time-btn" : "time-btn"}
            >
              <label htmlFor={value.time}>
                {value.label === "Morning" && (
                  <img src={morning} alt="slot" className="slot-img" />
                )}
                {value.label === "Late Morning" && (
                  <img src={morning} alt="slot" className="slot-img" />
                )}
                {value.label === "Afternoon" && (
                  <img src={sun} alt="slot" className="slot-img" />
                )}
                {value.label === "Late Afternoon" && (
                  <img src={sun} alt="slot" className="slot-img" />
                )}
                <div>
                  <span className="time-slot-btn-title">{value.time}</span>
                </div>
              </label>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default memo(TimeSlot);

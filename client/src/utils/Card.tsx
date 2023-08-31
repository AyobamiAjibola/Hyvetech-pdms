import React from "react";
// import Eye from "../../assets/svgs/eye.svg";
import Eye from "../assets/images/eye.png";
// import { BsEyeSlash } from "react-icons/bs";
import { Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Card = ({ name, price, qty, color, cardName, eyeD }: any) => {
  const [obscure, setObscure] = React.useState(false);
  return (
    <>
      <div
        style={{ backgroundColor: color, borderRadius: 34, color: "#494949" }}
      >
        <div
          // className="flex justify-between items-center px-6 pt-4 "
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 12, paddingRight: 20,
            paddingTop: 4
          }}
        >
          <div>
            <p
              // className="base-text font-montserrat"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                textAlign: 'left'
              }}
            >{name}</p>
            <h2
              // className="heading-two text font-montserrat"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                textAlign: 'center'
              }}
            >
              {!obscure ? price : "****"}
            </h2>
          </div>

          {eyeD && <IconButton onClick={() => setObscure(!obscure)}>
            {obscure ? (
              // <BsEyeSlash color="black" size={18} />
              <Visibility sx={{color: 'black', fontSize: 18}} />
            ) : (
              <img src={Eye} alt=""
                // className="w-[18px] h-[18px]"
                style={{
                  width: '18px',
                  height: '18px'
                }}
              />
            )}
          </IconButton>}
        </div>
        <div
          // className="flex px-6 pb-4 justify-end font-montserrat"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            textAlign: 'right',
            paddingLeft: 6,
            paddingRight: 20,
            paddingBottom: 12,
            display: 'flex',
            justifyContent: 'end'
          }}
        >

          {qty && (qty < 2 ? qty + ' ' + cardName : qty + ' ' + cardName + '(s)')}


        </div>
      </div>
    </>
  );
};

export default Card;

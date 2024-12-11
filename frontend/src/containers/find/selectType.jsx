import React from "react";
// import NestedCard from "../../components/card";
import styled from "styled-components";
import Box from "@mui/material/Box";
// import { useNMLab } from "../hooks/useNMLab";
import { useNavigate } from "react-router";
// import AdCard from "../../components/funcCard";
// import AdCard2 from "../../components/adCard2";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
const Wrapper = styled.div`
  width: 70%;
  height: 100%;
  margin: 5px 5px 5px 5px; // top right bottom left
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  justify-content: center;
`;
// overflow-y: scroll;

const types = ["尋找棧板", "放下棧板", "更新棧板資料", "新增棧板"];

export default function SelectType(props) {
  //   const { login, setLogin } = useNMLab();
  //   const navigate = useNavigate();
  //   const selectCard = (title) => {
  //     if (title === "註冊帳號") navigate("/register");
  //     else if (title === "列印／掃描") navigate("/printMenu");
  //   };
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Stack spacing={2} sx={{ width: 1 / 3, textAlign: "center" }}>
        {/* <ButtonGroup sx={{ width: 1 / 4 }} orientation="vertical" aria-label="Vertical navigation group"> */}
        <Typography variant="h2" component="h2">
          棧板管理系統
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/find")}>
          尋找棧板
        </Button>
        <Button variant="outlined" onClick={() => navigate("/drop")}>
          放下棧板
        </Button>
        <Button variant="outlined" onClick={() => navigate("/update")}>
          更新棧板資料
        </Button>
        <Button variant="outlined" onClick={() => navigate("/add")}>
          新增棧板
        </Button>
        {/* </ButtonGroup> */}
      </Stack>
    </Box>
  );
}

import React, { useEffect } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useIoT } from "../hooks/useIoT";
import CircularProgress from "@mui/material/CircularProgress";
import { use } from "react";

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

const pages = ["尋找棧板", "放下棧板", "更新棧板資料", "新增棧板"];

export default function Home(props) {
  console.log(import.meta.env.VITE_Mapbox_API_Token);
  const navigate = useNavigate();

  const { getNearPallet, availablePallet, getPalletInfo, setCheck, check, checkUserPallet, pending, setPending, userPos, getUserPos, task, setTask } = useIoT();

  useEffect(() => {
    switch (task) {
      case "find":
      case "putDown":
        // Todo: check if there is a pallet of this user
        checkUserPallet();
        break;
      case "update":
        getNearPallet();
        break;
      case "addPallet":
        setPending(false);
        navigate("/showPos");
        break;
      default:
        break;
    }
  }, [userPos]);

  useEffect(() => {
    // first get user position
    if (task !== "") {
      getUserPos();
      console.log("get user pos");
    }
  }, [task]);

  // check user's palletID existence
  useEffect(() => {
    console.log("check", check);
    if (check) {
      setPending(false);
      if (task === "putDown") {
        getPalletInfo();
        navigate("/showPos");
      } else if (task === "find") navigate("/selectType");
      setCheck(false);
    }
  }, [check]);
  useEffect(() => {
    if (task === "update") {
      setPending(false);
      navigate("/allPallet");
    }
  }, [availablePallet]);
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      {pending ? (
        <CircularProgress />
      ) : (
        <Stack spacing={2} sx={{ width: 1 / 3, textAlign: "center" }}>
          <Typography variant="h2" component="h2">
            棧板管理系統
          </Typography>
          <Button variant="outlined" onClick={() => setTask("find")}>
            尋找棧板
          </Button>
          <Button variant="outlined" onClick={() => setTask("putDown")}>
            放下棧板
          </Button>
          <Button variant="outlined" onClick={() => setTask("update")}>
            更新棧板資料
          </Button>
          <Button variant="outlined" onClick={() => setTask("addPallet")}>
            新增棧板
          </Button>
        </Stack>
      )}
    </Box>
  );
}

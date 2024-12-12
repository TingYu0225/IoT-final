import UserModel from "../models/User.js";

const sendData = (data, ws) => {
  console.log("server sendData");
  ws.send(JSON.stringify(data));
};

const checkUser = async (userID, pwd) => {
  const user = await UserModel.findOne({ userID });
  console.log(user, userID.pwd);
  if (!user) return { status: false, msg: "User not found" };
  if (user.pwd !== pwd) return { status: false, msg: "wrong password" };
  return { status: true, msg: user.userID };
};

export default {
  onMessage: (ws) => async (byteString) => {
    const { data } = byteString;
    const { type, payload } = JSON.parse(data);
    console.log("onmessage", data);

    switch (type) {
      case "takeAway": {
        break;
      }
      case "findPallet": {
        break;
      }
      case "putDown": {
        break;
      }
      case "Modify": {
        break;
      }
      case "checkUser": {
        const { userID, pwd } = payload;
        console.log(userID, pwd);
        const result = await checkUser(userID, pwd);
        console.log(result, "hi");
        sendData({ type: "checkUser", payload: result }, ws);
        break;
      }
      case "logout": {
        break;
      }
      case "addUser": {
        const { userID, pwd, status, last_position } = payload;

        try {
          const newUser = new UserModel({ userID, pwd, status, last_position });
          await newUser.save();
          //sendStatus({ type: "success", msg: "User added successfully" }, ws);
          console.log("hi");
        } catch (error) {
          //console.log({ type: "error", msg: "Failed to add user" }, ws);
          console.log(error);
        }
        break;
      }
      default:
        break;
    }
  },
};

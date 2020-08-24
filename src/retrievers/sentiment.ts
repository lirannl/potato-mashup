import Axios from "axios";
import ISentiment from "../interfaces/sentiment";

const determineSentiment = async (text: string) => {
  return await (
    await Axios.post(
      "https://sentim-api.herokuapp.com/api/v1/",
      { text: text },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
  ).data as ISentiment;
};

export default determineSentiment;

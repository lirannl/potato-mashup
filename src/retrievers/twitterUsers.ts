import Axios from "axios";
import Twit from "twit";
import { TwitterUser } from "../interfaces/twitterUser";

const Twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY!,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
  access_token: process.env.TWITTER_TOKEN!,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET!,
});

const getTweeter = async (name: string) => {
    return (await Twitter.get("users/search", {
     q: name, 
     count: 5,  
    })).data as TwitterUser[];
}

export default getTweeter;

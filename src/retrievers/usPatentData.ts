import Axios from "axios"

const retriever = async (patentNum: number) => {
    return await (await Axios.get(`https://developer.uspto.gov/ibd-api/v1/patent/application?patentNumber=${patentNum}&start=0`)).data.response;
}

export default retriever;
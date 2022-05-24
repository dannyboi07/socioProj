import axios from "axios";
import url from "./baseUrl";
const baseUrl = `${url}/api/search`;

async function getSearch(searchParam) {
	try {
		const response = await axios.get(`${baseUrl}?query=${searchParam}`);
		return response.data;
	} catch(err) {
		console.error(err);
	}

}

export { getSearch };
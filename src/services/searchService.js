import axios from "axios";
//const baseUrl = "http://localhost:3500/api/search";
const baseUrl = "https://secure-meadow-40264.herokuapp.com/api/search";

async function getSearch(searchParam) {
	try {
		const response = await axios.get(`${baseUrl}?query=${searchParam}`);
		return response.data;
	} catch(err) {
		console.error(err);
	}

}

export { getSearch };
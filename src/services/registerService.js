import axios from "axios";
import url from "./baseUrl";
const baseUrl = `${url}/api/register`;

async function registerUser(userDetails) {
	const response = await axios.post(baseUrl, userDetails);
	return response.data;
}

export { registerUser };
import axios from "axios";
import url from "./baseUrl";
const baseUrl = `${url}/api/login`;

async function loginUser(userDetails) {
	const response = await axios.post(baseUrl, userDetails);
	return response.data;
}

export { loginUser };
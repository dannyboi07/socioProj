import axios from "axios";
//const baseUrl = "http://localhost:3500/api/register";
const baseUrl = "https://secure-meadow-40264.herokuapp.com/api/register";

async function registerUser(userDetails) {
	const response = await axios.post(baseUrl, userDetails);
	return response.data;
}

export { registerUser };
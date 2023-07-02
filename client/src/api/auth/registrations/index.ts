import client from "@/api";
import RegistrationsRequestBody from "./registrations.type";

const URL = "/auth/registration"

const registrations = async (body: RegistrationsRequestBody) => {
	const response = await client.post(URL, body);
	return response;
}

export default registrations;

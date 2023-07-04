import client from "@/api";
import RegistrationsRequestBody from "./registrations.type";

const URL = "/auth/registration"

const registrations = async (payload: RegistrationsRequestBody) => {
	const response = await client.post(URL, payload);
	return response;
}

export default registrations;

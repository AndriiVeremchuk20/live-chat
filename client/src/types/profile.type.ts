interface Profile {
	avatar_path?: string;
	age: number;
	country: string;
	gender: genderType;
	partner_gender: genderType;
	about_self: string;
	about_partner: string;
}

export type genderType = "MALE"|"FEMALE"|"BINARY";

export default Profile;


interface Profile {
	avatar_path: string|null;
	age: number;
	country: string;
	gender: genderType;
	partner_gender: genderType;
	about_self: string;
	about_partner: string;
}

export type genderType = "MALE"|"FEMALE"|"BINARY";

export default Profile;


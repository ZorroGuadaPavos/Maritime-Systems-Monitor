export type Body_login_login_access_token = {
	grant_type?: string | null;
	username: string;
	password: string;
	scope?: string;
	client_id?: string | null;
	client_secret?: string | null;
};



export type HTTPValidationError = {
	detail?: Array<ValidationError>;
};



export type Token = {
	access_token: string;
	token_type?: string;
};



export type UserPublic = {
	email: string;
	is_active?: boolean;
	is_superuser?: boolean;
	full_name?: string | null;
	id: string;
};



export type UserRegister = {
	email: string;
	password: string;
	full_name?: string | null;
};



export type ValidationError = {
	loc: Array<string | number>;
	msg: string;
	type: string;
};



export type ValveListPublic = {
	data: Array<ValvePublic>;
	count: number;
};



export type ValvePublic = {
	is_open?: boolean;
	identifier: string;
};



export type VesselList = {
	name: string;
	id: string;
};



export type VesselListPublic = {
	data: Array<VesselList>;
	count: number;
};



export type VesselPublic = {
	name: string;
	id: string;
};


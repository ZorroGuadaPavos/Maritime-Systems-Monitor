import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';

import type { Body_login_login_access_token,Token,UserPublic,UserRegister,ValveListPublic,ValvePublic,VesselListPublic,VesselPublic } from './models';

export type LoginData = {
        LoginAccessToken: {
                    formData: Body_login_login_access_token
                    
                };
    }

export type UsersData = {
        RegisterUser: {
                    requestBody: UserRegister
                    
                };
    }

export type VesselsData = {
        ReadVessel: {
                    vesselId: string
                    
                };
ReadVessels: {
                    limit?: number
skip?: number
                    
                };
ReadValves: {
                    limit?: number
skip?: number
vesselId: string
                    
                };
UpdateValve: {
                    isOpen: boolean
valveIdentifier: string
vesselId: string
                    
                };
FlowConnectedEquipment: {
                    equipmentIdentifer: string
vesselId: string
                    
                };
    }

export class LoginService {

	/**
	 * Login Access Token
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static loginAccessToken(data: LoginData['LoginAccessToken']): CancelablePromise<Token> {
		const {
formData,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/access-token',
			formData: formData,
			mediaType: 'application/x-www-form-urlencoded',
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export class UsersService {

	/**
	 * Read User Me
	 * Get current user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static readUserMe(): CancelablePromise<UserPublic> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/me',
		});
	}

	/**
	 * Register User
	 * Create new user without the need to be logged in.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static registerUser(data: UsersData['RegisterUser']): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/signup',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export class VesselsService {

	/**
	 * Read Vessel
	 * Get vessel.
	 * @returns VesselPublic Successful Response
	 * @throws ApiError
	 */
	public static readVessel(data: VesselsData['ReadVessel']): CancelablePromise<VesselPublic> {
		const {
vesselId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/vessels/{vessel_id}',
			path: {
				vessel_id: vesselId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Vessels
	 * Get list of vessels.
	 * @returns VesselListPublic Successful Response
	 * @throws ApiError
	 */
	public static readVessels(data: VesselsData['ReadVessels'] = {}): CancelablePromise<VesselListPublic> {
		const {
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/vessels/',
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Valves
	 * Get valves of a vessel.
	 * @returns ValveListPublic Successful Response
	 * @throws ApiError
	 */
	public static readValves(data: VesselsData['ReadValves']): CancelablePromise<ValveListPublic> {
		const {
vesselId,
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/vessels/{vessel_id}/valves',
			path: {
				vessel_id: vesselId
			},
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Valve
	 * Update valve of a vessel.
	 * @returns ValvePublic Successful Response
	 * @throws ApiError
	 */
	public static updateValve(data: VesselsData['UpdateValve']): CancelablePromise<ValvePublic> {
		const {
vesselId,
valveIdentifier,
isOpen,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/vessels/{vessel_id}/valves/{valve_identifier}',
			path: {
				vessel_id: vesselId, valve_identifier: valveIdentifier
			},
			query: {
				is_open: isOpen
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Flow Connected Equipment
	 * Get connected equipment.
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static flowConnectedEquipment(data: VesselsData['FlowConnectedEquipment']): CancelablePromise<Array<string>> {
		const {
vesselId,
equipmentIdentifer,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/vessels/{vessel_id}/connected-equipment/{equipment_identifer}',
			path: {
				vessel_id: vesselId, equipment_identifer: equipmentIdentifer
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}
import { BaseApi } from './base';

export class AuthAPI extends BaseApi {
    register ( email, username, password, reEnterPassword, otp ) {
        return this.post( `/authen/register?email=${ email }&username=${ username }&password=${ password }&reEnterPassword=${ reEnterPassword }&otp=${ otp }` );
    }
}

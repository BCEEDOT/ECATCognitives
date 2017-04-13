import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";

@Injectable()
export class AuthUtilityService {

    constructor(private jwtHelper: JwtHelper) {

    }

    public validateToken(token: any): boolean {

        if (!token) { return false };

        if (this.jwtHelper.isTokenExpired(token)) { return false; }

        console.log(
            //TODO: Check if token is valid
            this.jwtHelper.decodeToken(token),
            this.jwtHelper.getTokenExpirationDate(token),
            this.jwtHelper.isTokenExpired(token)
        );

        return true;
    }



}
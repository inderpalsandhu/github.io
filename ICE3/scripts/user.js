"use strict";

(function (core){
    class User{
        constructor(displayName = "", emailAddress = "",
                    userName = "", password = "") {
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._userName = userName;
            this._password = password;
        }
        get displayName() {
            return this._displayName;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        get userName() {
            return this._userName;
        }

        set displayName(displayName) {
            this._displayName = displayName;
        }

        set emailAddress(emailAddress) {
            this._emailAddress = emailAddress;
        }

        set userName(userName) {
            this._userName = userName;
        }

        toString() {
            return `Display Name: ${this._displayName}
            \nEmail Address: ${this._emailAddress}\nUsername: ${this._userName}`;
        }

        toJSON(){
            return {
                DisplayName : this._displayName,
                EmailAddress: this._emailAddress,
                UserName: this._userName,
                Password: this._password
            }
        }

        fromJSON(data){
            this._displayName = data.DisplayName;
            this._emailAddress = data.EmailAddress;
            this._userName = data.UserName;
            this._password = data.Password;
        }

        serialize(){
            if(this._displayName !==""&& this._emailAddress !==""&& this._userName !==""){
                return `${this._displayName}, ${this._emailAddress}, ${this._userName}`;
            }
            console.error("[ERROR] Failed to serialize. One or more user properties are missing");
        }

        deserialize(data){
            let propertyArray = data.split(',');
            this._displayName = propertyArray[0];
            this._emailAddress = propertyArray[1];
            this._userName = propertyArray[2];
        }
    }
    core.User = User;
})(core || (core = {}));
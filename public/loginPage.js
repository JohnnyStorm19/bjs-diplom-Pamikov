
"use strict"
let userLogin = new UserForm();
userLogin.loginFormCallback = function(data) {
    const callback = (response) => {
        if(response.success) {
            location.reload();
        } else {
            userLogin.setLoginErrorMessage(response.error);
        }
    }
    ApiConnector.login({login: data.login, password: data.password}, callback);
}
userLogin.registerFormCallback  = function(data) {
    const callback = (response) => {
        if(response.success) {
            location.reload();
        } else {
            userLogin.setRegisterErrorMessage(response.error);
        }
    }
    ApiConnector.register({login: data.login, password: data.password}, callback);
}
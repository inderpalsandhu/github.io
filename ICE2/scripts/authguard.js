"use strict";

(function (){
    if(!sessionStorage.getItem("user")){
        console.log("[AUTHGUARD] Unauthorized access detected. Redirecting tp login page");
        location.href = "login.html";

    }
})();


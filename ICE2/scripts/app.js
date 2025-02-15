"use strict";

//IIFE - Immediately Invoked Functional Expression


(function () {

    function CheckLogin(){
        console.log("[INFO] CheckLogin status");

        const loginNav = document.getElementById("login");
        if (!loginNav) {
            console.warn("[WARNING] loginNav element not found! Skipping check login");
            return;
        }
        const userSession = sessionStorage.getItem("user");
        if (userSession) {
            loginNav.innerHTML =`<i class="fas fa-sign-out-alt"></i> Logout `;
            loginNav.href = "#";

            loginNav.addEventListener("click",(event) =>{
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href="login.html";

            })
        }


    }









    function updateActiveNewLink(){
        console.log("[INFO] updating active nav Link")

        const currentPage = document.title.trim()
        const navLinks = document.querySelectorAll("nav a");
        navLinks.forEach(link => {
            if(link.textContent === currentPage){
                link.classList.add("active");
            }else{
                link.classList.remove("active");
            }
        })
    }


    /**
     * Dynamically load the header from the header.html into the current page
     */

    async function LoadHeader(){
        console.log("[INFO] Loading Header...")
        return fetch("header.html")
            .then(response => response.text())
            .then(data =>{
                document.querySelector("header").innerHTML = data;
                updateActiveNewLink()

            })
            .catch(error => {console.error("[ERROR] Unable to load header");

            });

    }
    function DisplayLoginPage(){
        console.log("[INFO]Display LoginPage called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        // message Area
        messageArea.style.display = "none";

        if(!loginButton){
            console.error("[Error] Unable to login button not found");
            return;
        }
        loginButton.addEventListener("click", async (event)=>{
            event.preventDefault();

            //retreive passed in form parameters
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
            // the await keyword tells javascript to pause here until the fetch request completes

            const response = await fetch("data/users.json")
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}Unable to fetch data.`);
            }

            const jsonData = await response.json();
             //console.log("DEBUG] fectched JSON Data:", jsonData);

            const users = jsonData.users;
           console.log(users);
//            if(!Array.isArray(users)){
//                throw new Error("[Error] Json data not contain a valid array")
//            }

            let success = false;
            let authenticateUser = null;

            for (const user of users){
                if(user.Username === username && user.Password === password){
                    success = true;
                    authenticateUser = user;
                    break;
                }
            }
            if(success){
                sessionStorage.setItem("user", JSON.stringify({
                    DisplayName: authenticateUser.DisplayName,
                    EmailAddress : authenticateUser.EmailAddress,
                    Username : authenticateUser.username

                    }));
                messageArea.classList.remove("alert","alert-danger");
                messageArea.style.display = "none";
                location.href = "contact-list.html";
            }else {
                messageArea.classList.add("alert","alert-danger");
                messageArea.textContent = "Invalid Username or password";
                messageArea.style.display = "block";

                document.getElementById("username").focus();
                document.getElementById("username").select();

                }
            }catch(error){
                console.error("[ERROR] Login failed ...", error);
            }
        });

        cancelButton.addEventListener("click",  (event)=>{
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        })
    }

    function DisplayRegisterPage(){
        console.log("[INFO]Display RegisterPage called...");








    }


    /**
     * redirect user back to contact-list.html
     */
    function handleCancelClick(){
        location.href="contact-list.html";
    }

    /**
     * Handle the process of editing an existing contact
     * @param event
     * @param contact
     * @param page
     */
    function handleEditClick(event, contact, page){

        event.preventDefault();
        if (!validateForm()){
            alert("Invalid data! please check your inputs")
            return;

        }
        const fullName = document.getElementById("fullName").value;
        const emailAddress = document.getElementById("emailAddress").value;
        const contactNumber = document.getElementById("contactNumber").value;

        //update the contact information
        contact.fullName = fullName;
        contact.emailAddress = emailAddress;
        contact.contactNumber = contactNumber;


        //save the update contact back to local storage
        localStorage.setItem(page,contact.serialize());

        location.href ="contact-list.html";
    }
    function handleAddClick(event){
        event.preventDefault();
        if (!validateForm()) {
            alert("Form Contains error. Please correct them before submitting.")
            return;

        }
        // read in form fields
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        AddContact(fullName, contactNumber, emailAddress);

        location.href="contact-list.html";


    }


    function addEventListenerOnce(elementId,event,handler){
        console.log(`${elementId} handled`);
        const elements = document.getElementById(elementId);

        if (elements){
            elements.removeEventListener(event,handler);
            elements.addEventListener(event,handler);
        }else {
            console.warn(`[WARN] Element with ID'${elementId}'not found`);
        }

    }


    /**
     * validate the entire form  by checking the validity of each input fields
     * @returns {boolean} - return true if all fields pass validation , false otherwise
     */

    function validateForm(){
        return(
            validationInput("fullName") &&
                validationInput("contactNumber") &&
                    validationInput("emailAddress")
        );
    }
    /**
     * validates an input fields based on predefinesd validation rules
     * @param fieldId
     * @returns {boolean}
     */
    function validationInput(fieldId){
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        const rule = VALIDATION_RULES[fieldId];

        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rule not found for ${ fieldId }`);
            return false;
        }
        // Test 1 for empty input
        if (field.value.trim() === "") {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }
        // check if the input fails to match
        if(!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        // Clear the error message if validation passes

        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;


    }



    function attachValidationListeners() {

        console.log("[INFO] Attaching validation listeners...");
        //Iterate over each field defined in VALIDATION_RULES
        Object.keys(VALIDATION_RULES).forEach((fieldId)=>{
            const field = document.getElementById(fieldId)
            if (!field){
                console.warn(`[WARNING] Field ${fieldId} not found,Skipping listener attachment`);
                return;
            }
            // attach event listener using a centralized validation
            addEventListenerOnce(fieldId, "input",()=> validationInput(fieldId));


        });

    }

    const VALIDATION_RULES ={
        fullName:{
            regex: /^[A-Za-z\s]+$/, //allows for only letter and spaces
            errorMessage: "Full name must contain only letters and Spaces"

        },
        contactNumber:{
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Phone number must be a number"
        },
        emailAddress:{
            regex: /^\w+@\w+\.\w+$/,
            errorMessage: "Email address must be a valid email address"
        }

    }





    function AddContact(fullName, contactNumber, emailAddress){
        console.log("[DEBUG] AddContact() triggered ...")
        if (!validateForm()){
            alert("Form contains errors! please check your inputs")
            return
        }

        let contact = new core.Contact(fullName, contactNumber, emailAddress );
        if(contact.serialize()){
            // the primary key for a contact --> contact + date & time
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
        }else{
            console.error("[WARNING] AddContact() triggered ...");
        }
        //redirect user after successful contact addition
        location.href="contact-list.html";
    }


    function DisplayEditPage(){
        console.log("DisplayEditPage() called......");

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");


        switch (page) {
            case "add": {
                document.title = "Add Contact";
                //Add contact
                const heading = document.querySelector("main>h1").textContent = "Add Contact";


                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"> </i> Add`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");

                }
                addEventListenerOnce("editButton", "click", handleAddClick);
                addEventListenerOnce("cancelButton", "click", handleCancelClick);

                break;
            }
            default:
            {
                //Edit contact
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);
                if (contactData) {
                    contact.deserialize(contactData);
                }
                document.getElementById("fullName").value = contact.fullName
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"> </i> Edit`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                addEventListenerOnce("editButton", "click",
                    (event)=>handleAddClick(event,contact,page));
                addEventListenerOnce("cancelButton", "click", handleCancelClick);

                break;

            }
        }
    }

    async function DisplayWeather(){

        const apiKey = "894a46763dc7b4783cfdea00b7cea3ae";
        const city = "oshawa"
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            // NOT 200 OK
            if(!response.ok) {
                throw new Error("Failed to fetch weather data from openweathermap.org");
            }
            const data = await response.json();
            console.log("Weather API Response",data);

            const weatherDataElement = document.getElementById("weather-data");
            weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name} <br>
                                            <strong>Temperature: </strong> ${data.main.temp} <br>
                                            <strong>Weather: </strong> ${data.weather[0].description} `;
        }catch (error) {
            console.error("Error fetching weather data", error);
        document.getElementById("weather-data").textContent="Unable to contact weather data at this time";

        }
    }


    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            console.log(keys);

            let index = 1;
            for(const key of keys){

                if(key.startsWith("contact_")) {

                    let contactData = localStorage.getItem(key);

                    try {
                        console.log(contactData);
                        let contact = new core.Contact();
                        contact.deserialize(contactData); // deserialize contact csv

                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th> 
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    <td class="text-center">
                                    <button value="${key}" class="btn btn-warning btn-sm edit"><i class="fas fa-pencil-alt"></i> Edit
                                    </button>                                  
                                    </td>
                                    <td class="text-center">
                                    <button value="${key}" class="btn btn-danger btn-sm delete"><i class="fa-solid fa-trash"></i> Delete
                                    </button>
                                    </td>
                                </tr>`;
                        index++;

                    }catch (error){
                        console.error("Error deserializing contact data")
                    }

                }else {
                    console.warn("Skipping non-contact key")
                }
            }
            contactList.innerHTML = data;
        }

        const addButton = document.getElementById("addButton");
        if(addButton) {
            addButton.addEventListener("click", () => {
                location.href = "edit.html#add"
            })
        }

        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function () {
                if (confirm("Are you sure? To delete????")) {
                    localStorage.removeItem(this.value);
                    location.href ="contact-list.html";
                }
            })
        })

        const editButtons =document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function () {
                //concatenate the value from the edit link to the edit.html#{key}
                location.href ="edit.html#" + this.value;
            })
        })

    }


    function DisplayHomePage(){
        console.log("Calling DisplayHomePage()...");



        let aboutUsBtn = document.getElementById("AboutUsBtn");
        aboutUsBtn.addEventListener("click",()=> {
            location.href = "about.html";
        });

        DisplayWeather();

        document.querySelector("main").insertAdjacentHTML(
            "beforeend",
           ` <p id = "MainParagraph" class = "mt-5"> This is the paragraph from the query selector</p>`
        );

        document.querySelector("main").insertAdjacentHTML(
            "beforeend",
            ` <article class = "container">
                            <p id = "ArticleParagraph" class = "mt-3">This is my article paragraph from the selector</p>\
                    </article>`

        );


    }

    function DisplayAboutPage(){
        console.log("Calling DisplayAboutPage()...");

    }

    function DisplayProductsPage(){
        console.log("Calling DisplayProductsPage()...");
    }

    function DisplayServicesPage(){
        console.log("Calling DisplayServicesPage()...");
    }

    function DisplayContactPage(){
        console.log("Calling DisplayContactPage()...");

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(event){
            console.log("Sending button event");
            if(!validateForm()){
                alert("Please fix your errors before submitting")
                return;
            }

            event.preventDefault();
            if (subscribeCheckbox.checked){
               AddContact(
                   document.getElementById("fullName").value,
                   document.getElementById("contactNumber").value,
                   document.getElementById("emailAddress").value,
               );
            }
            alert("Form Submit Successfully");

        });



    }

    async function Start() {
        console.log("Starting...")
        console.log(`Current document title: ${document.title}`)

        //Load Header first
        await LoadHeader().then(() => {
            CheckLogin();
        });


        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;

            case "Contact":
                attachValidationListeners()
                DisplayContactPage();
                break;

            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                attachValidationListeners()
                DisplayEditPage();
                break;
            case "Login":

                DisplayLoginPage();
                break;
            case "Register":
                attachValidationListeners()
                DisplayRegisterPage();
                break;
            default:
                console.error("No matching case for the page title");
        }

    }

    window.addEventListener("DOMContentLoaded",()=>{
        console.log("DOM fully loaded and parsed")
        Start();
    });


})();
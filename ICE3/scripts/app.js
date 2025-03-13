"use strict";

import {LoadHeader,CheckLogin} from "./header.js";
import {Router} from "./router.js";
import {AuthGuard} from "./authguard.js";
import {LoadFooter} from "./footer.js";

const pageTitles={
    "/" : "Home",
    "/home" : "Home",
    "/about" : "About",
    "/products" : "Products",
    "/services" : "Services",
    "/contact" : "Contact",
    "/contact-list" : "ContactList",
    "/edit" : "Edit Page",
    "/login" : "Login Page",
    "/register" : "Register Page",
    "/404" : "Page Not Found"
};


const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact": "views/pages/contact.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/404": "views/pages/404.html"
};

const router = new Router(routes);

//IIFE - Immediately Invoked Functional  Expression
(function () {

    function DisplayLoginPage(){
        console.log("[INFO] DisplayLoginPage called...");

        if(sessionStorage.getItem("user")){
            router.navigate("/contact-list");
            return;


        }
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        //message area
        messageArea.style.display = "none";

        if(!loginButton){
            console.error("[ERROR] Unable to login button not found");
            return;
        }

        loginButton.addEventListener("click", async (event)=>{
            // prevent default form submission
            event.preventDefault();

            // retrieve passed in form parameters
            const userName = document.getElementById("userName").value.trim();
            const password = document.getElementById("password").value.trim();

            try{
                // the await keyword tells Javascript to pause here (thread) until the fetch request complete
                const response = await fetch("data/users.json");

                if(!response.ok){
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const jsonData = await response.json();
                console.log("[DEBUG] Fetched JSON Data:", jsonData);
                const users = jsonData.users;

                if(!Array.isArray(users)){
                    throw new Error("[ERROR] JSON data does not contain a valid array");
                }

                let success = false;
                let authenticatedUser = null;

                for (const user of users){
                    if(user.Username === userName && user.Password === password){
                        success=true;
                        authenticatedUser=true;
                        break;
                    }
                }

                if(success){
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        UserName : authenticatedUser.UserName,
                    }));

                    messageArea.classList.remove("alert", "alert-danger");
                    messageArea.style.display = "none";
                    LoadHeader().then(() => {
                        CheckLogin();
                        router.navigate("/contact-list");
                    });
                }else{
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again.";
                    messageArea.style.display = "block";

                    document.getElementById("userName").focus();
                    document.getElementById("userName").select();
                }
            }catch(error){
                console.error("[ERROR] Login failed", error);
            }
        });

        // handle cancel event
        cancelButton.addEventListener("click", (event)=>{
            document.getElementById("loginForm").reset();
            router.navigate("/");
        });
    }

    function DisplayRegisterPage(){
        console.log("[INFO] DisplayRegisterPage called...");
    }

    /**
     * Redirect the user back to contact-list.html
     */
    function handleCancelClick() {
        //location.href="contact-list.html";
        router.navigate("/contact-list");
    }
    /**
     * Handle the process of editing an existing contact
     * @param event
     * @param contact
     * @param page
     */
    function handleEditClick(event, contact, page){
        event.preventDefault();

        if(!validateForm()){
            alert("Invalid data! Please check your inputs")
            return;

        }

        // read in form field
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // Update the contact information
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;


        localStorage.setItem(page, contact.serialize());

        //redirect
        router.navigate("/contact-list");


    }
    /**
     * Handles the process of adding a new contact
     * @param event - the event object to prevent default form submission
     */
    function handleAddClick(event){

        // prevent form default form submission
        event.preventDefault();

        if(!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }

        // read in form fields
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // Create and save new contact
        AddContact(fullName, contactNumber, emailAddress);

        // redirect to contact list
        router.navigate("/contact-list");
    }

    function addEventListenerOnce(elementId, event, handler){

        // retrieve the element from the DOM
        const element = document.getElementById(elementId);

        if(element){
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler);
        }else{
            console.warn(`[WARN] Element with ID '${elementId}' not found`);
        }

    }
    /**
     * Validate the entire form by checking the validity of each input field
     * @return {boolean} - return ture if all fields pass validation, false otherwise
     */
    function validateForm(){
        return (
            validateInput("fullName") &&
            validateInput("contactNumber") &&
            validateInput("emailAddress")
        );
    }


    /**
     * Validates on input field based on predefined validation rules
     * @param fieldId
     * @returns {boolean}
     */
    function validateInput(fieldId){
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        const rule = VALIDATION_RULES[fieldId];

        if(!field ||!errorElement || !rule) {
            console.warn(`[WARN] Validation rule not found for ${fieldId}`);
            return false;
        }

        // Test for empty input
        if(field.value.trim()==="") {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;

        }

        // check if the input fails match to the
        if(!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;

    }

    function attachValidationListeners(){
        console.log("[INFO] attach Validation Listeners");

        Object.keys(VALIDATION_RULES).forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (!fieldId) {

                console.warn(`[Warning] Field  '${fieldId}' not found. skipping listener attachment`);
                return;

            }

            addEventListenerOnce(fieldId,"input", () => validateInput(fieldId));
        });
    }
    /**
     * Centralized validation rules for form input fields
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber:
     * {regex: RegExp, errorMessage: string}, emailAddress: {regex: RegExp, errorMessage: string}}}
     */
    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/, // allows for only letters and spaces
            errorMessage: "Full Name must be contain only letters and spaces"
        },

        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be a number in the format XXX-XXX-XXXX"
        },

        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Email address must be a valid email address"
        }
    };

    function AddContact(fullName, contactNumber, emailAddress){

        console.log("[DEBUG] AddContact() triggered...");

        if(!validateForm()){
            alert("Form contains errors. please correct your input before submitting ");
            return
        }

        let contact = new core.Contact(fullName, contactNumber, emailAddress);

        if(contact.serialize()){
            // the primary key for a contact --> contact_ + date and time
            let key = `contact_${Date.now()}`
            localStorage.setItem(key, contact.serialize());
        } else{
            console.error(`[ERROR] contact serialize failed`);
        }

        //redirects the user after successful submitting
        router.navigate("/contact-list");
    }

    function DisplayEditPage(){
        console.log("DisplayEditPage() called...");

        // Extract contact id from the path
        const page = location.hash.split("#")[2];
        const editButton = document.getElementById("editButton");

        switch(page){
            case "add":
            {
                // Update browser tab
                document.title = "Add Contact";

                // Add contact
                document.querySelector("main>h1").textContent = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = `<i class="fas fa-plus-circle fa-sm"></i> Add`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");

                }

                addEventListenerOnce("editButton", "click", handleAddClick);
                addEventListenerOnce("cancelButton", "click", handleCancelClick);
                break;
            }
            default:
            {
                // Edit Contact
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                if (contactData) {
                    contact.deserialize(contactData);
                }

                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                if(editButton){
                    editButton.innerHTML =` <i class="fa-solid fa-pen-to-square"></i> Edit`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                addEventListenerOnce("editButton", "click",
                    (event)=>handleEditClick(event, contact, page));
                addEventListenerOnce("cancelButton", "click", handleCancelClick);

                break;
            }
        }
    }

    async function DisplayWeather(){

        const apiKey = "0abc4886efb22a58fcad1d0cb3f10649";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try{

            const response = await fetch(url);

            // Not 200 OK
            if(!response.ok){
                throw new Error("Failed to fetch weather data from openweathermap.org");
            }

            const data = await response.json();
            console.log("Weather API Response", data);

            const weatherDataElement = document.getElementById("weather-data");

            weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name} <br>
                                            <strong>Temperature: </strong> ${data.main.temp} <br>
                                            <strong>Weather: </strong> ${data.weather[0].description} `;
        }catch(error){
            console.error("Error fetching weather data", error);
            document.getElementById("weather-data").textContent = "Unable to connect weather data at this time";
        }
    }
    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage");

        if(localStorage.length>0){
            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            console.log(keys);

            let index = 1;
            for(const key of keys){

                if(key.startsWith("contact_")){
                    let contactData = localStorage.getItem(key);

                    try{
                        console.log(contactData);
                        let contact = new core.Contact();
                        contact.deserialize(contactData);           // deserialize contact csv to contact object

                        data += `<tr>
                                 <th scope="row" class="text-center">${index}</th>
                                 <td>${contact.fullName}</td>
                                 <td>${contact.contactNumber}</td>
                                 <td>${contact.emailAddress}</td>
                                 <td class="text-center">
                                     <button value ="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-pen-to-square"></i> Edit
                                     </button>
                                 </td>
                                 <td class="text-center">
                                    <button value ="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-trash"></i> Delete
                                    </button>
                                 </td>
                                 </tr>`;
                        index++;
                    }catch(error){
                        console.error("Error deserializing contact data");
                    }
                }else{
                    console.warn("Skipping non-contact key");
                }
            }
            contactList.innerHTML = data;
        }

        const addButton =  document.getElementById("addButton");
        if(addButton){
            addButton.addEventListener("click", ()=> {
                router.navigate("/edit#add");
            });
        }

        const deleteButtons =  document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function(){
                const contactKey = this.value // get the contact key from the button value
                console.log(`[Debug] Deleting the contact ID : ${contactKey}`);

                if (!contactKey.startsWith("contact_")){
                    console.error("[ERROR] Invalid contact key format", contactKey);
                    return;


                }

                if(confirm("Delete Contact, please confirm?")){
                    localStorage.removeItem(this.value);
                    DisplayContactListPage();
                }
            });
        });


        const editButtons =  document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function(){
                router.navigate(`/edit#${this.value}`);
            });
        });
    }

    function DisplayHomePage(){
        console.log("Calling DisplayHomePage()...");

        const main = document.querySelector("main");
        main.innerHTML = "";

        main .insertAdjacentHTML(
            "beforeend",
            `<button id="AboutUsBtn" class="btn btn-primary">About Us</button>

                <div id="weather">
                    <h3>Weather Information</h3>
                    <p id="weather-data">Fetching weather data...</p>
                </div>
                
                <p id="MainParagraph" class="mt-5">This is my main paragraph</p>
                <article class="container">
                    <p id="ArticleParagraph" class="mt-3"></p>
                </article>`
        );
        const AboutUsBtn = document.getElementById("AboutUsBtn");
        // arrow notation
        AboutUsBtn.addEventListener("click", ()=>{
            router.navigate("/about");
        });

        // Add call to weathermap.org
        DisplayWeather();

    }

    function DisplayAboutPage(){
        console.log("Calling AboutPage()...");
    }

    function DisplayProductsPage(){
        console.log("Calling ProductsPage()...");
    }

    function DisplayServicesPage(){
        console.log("Calling ServicesPage()...");
    }

    function DisplayContactPage(){
        console.log("Calling ContactsPage()...");

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(event){

            event.preventDefault();

            if(!validateForm()){
                alert("Please fix your errors before submitting");
                return;
            }

            if(subscribeCheckbox.checked){
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value,
                );
            }

            alert("Form submitted successfully");
        });

        const contactListButton = document.getElementById("showContactList");
        contactListButton.addEventListener("click", function (event){
            event.preventDefault();
            router.navigate("/contact-list");
        })

    }

    /**
     * Listen for changes and update the navigation links
     */
    document.addEventListener("routeLoaded", (event) => {
        const newPath = event.detail;   // extract the route from the event passed
        console.log(`[INFO] Route Loaded: ${newPath}`);

        LoadHeader().then(() =>{
            handlePageLogic(newPath);
        });

    });


    /**
     * Session expired, redirecting the user to login page.
     */

    window.addEventListener('sessionExpired', () => {
        console.warn("[SessionExpired] Redirecting to login page due to inactivity");
        router.navigate("/login");

    })

    function handlePageLogic(path){
        //Update Page title
        document.title = pageTitles[path] || "Untiled Page";

        //check authentication level for protected pages
        const protectedRoutes = ["/contact-list","/edit"];
        if(protectedRoutes.includes(path)){
            AuthGuard(); //redirect user to login page
        }


        switch(path){
            case "/":
            case "/home":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/contact":
                DisplayContactPage();
                attachValidationListeners()
                break;
            case "/products":
                DisplayProductsPage();
                break;
            case "/services":
                DisplayServicesPage();
                break;
            case "/contact-list":
                DisplayContactListPage();
                break;
            case "/edit":
                DisplayEditPage();
                attachValidationListeners()
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            default:
                console.warn(`[WARN] No display logic found for: ${path}`);
        }
    }
    async function Start() {
        console.log("Starting...");
        console.log(`Current document title: ${document.title}`);

        // Load header first, then run CheckLogin after
        await LoadHeader();
        await LoadFooter();
        AuthGuard();

        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);

        handlePageLogic(currentPath);
    }
    window.addEventListener("DOMContentLoaded", () =>{
        console.log("DOM fully loaded and parsed");
        Start();
    });

})()
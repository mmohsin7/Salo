$(document).ready(
    function()
    {
        var auth;
        var db;
        const firebaseConfig = {
            apiKey: "AIzaSyDSB2rePH62fBGh94yOFj3Q5yDuiIszY9w",
            authDomain: "mohsinsalodb.firebaseapp.com",
            projectId: "mohsinsalodb",
            storageBucket: "mohsinsalodb.firebasestorage.app",
            messagingSenderId: "961251881312",
            appId: "1:961251881312:web:304469c31c53dc0fecae05",
            measurementId: "G-8CY7549CKR"
          };

          try{
              firebase.initializeApp(firebaseConfig);
              auth = firebase.auth();
              db = firebase.firestore();
          }
          catch(e){alert(e);}

        // if already logged in
        function isUserLoggedIn() {
            const userId = localStorage.getItem("UserID");
            return userId !== null;
        }

        if(isUserLoggedIn())
        {
            window.location.replace("app/app.html");
        }


        
        // nav bar
        $(window).scroll(
            function ()
            {
                let nav_bar = $(".nav-bar");
                if ($(this).scrollTop() > 100)
                {
                    nav_bar.addClass("scrolled");
                }
                else
                {
                    nav_bar.removeClass("scrolled");
                }

                if (!$(".menu").hasClass("show"))
                {
                    let brandlogo = $(".nav-header a");
                    if ($(window).scrollTop() > $(window).height() - 100)
                    {
                        brandlogo.removeClass("hidden");
                    }
                    else
                    {
                        brandlogo.addClass("hidden");
                    }
                }
            }
        );

        $('.menu-button').click(
            function()
            {
                $('.menu').toggleClass("show");
                $(this).toggleClass("open");

                let brandlogo = $(".nav-header a");
                if (brandlogo.hasClass("hidden"))
                {
                    brandlogo.removeClass("hidden");
                }
                else
                {
                    $(window).trigger("scroll");
                }
            }
        );

        $('.nav-bar .menu li a').click(
            function()
            {
                let menu = $(".menu");
                if (menu.hasClass("show"))
                {
                    menu.removeClass("show"); 
                    $('.menu-button').removeClass("open");
                }
            }
        );
        

        let navlinks = $(".nav-bar .menu li a");

        function update_active_nav() {
            let scroll_position = $(window).scrollTop() + 200;
            
            navlinks.each(function () {
                let section = $($(this).attr("href"));
                
                if (section.length && section.offset().top <= scroll_position && section.offset().top + section.outerHeight() > scroll_position)
                {
                    $(".nav-bar .menu li a.active").removeClass("active");
                    $(this).addClass("active");
                }
            });
        }

        $(window).on("scroll", update_active_nav);

        // tenstimonial card repeat for smooth slide animation
        let testimonialsContainer = $('.testimonials-section-content-slider');
        let originalCards = testimonialsContainer.children().clone();
        testimonialsContainer.append(originalCards);

        // chat box
        var AlertBox = $("#chat-popup");
    
        $("#close-chat-popup").click(
            function()
            {
                clearChat();
                CloseAlert();
            }
        );
        
        function OpenAlert() {
            document.body.classList.add("no-scroll");
            AlertBox.addClass("show");
        }
            
        function CloseAlert() {
            document.body.classList.remove("no-scroll");
            AlertBox.removeClass("show");
        }

        $("#open-chat-button").click(
            function()
            {
                showWelcomeMessage();
                OpenAlert();
            }
        );

        const responses = {
            "assalam u alaikum": "Walaikum Assalam! How can I assist you today?",
            "walaikum assalam": "How can I assist you today?",
            "hello": "Hello! How can I help you?",
            "hi": "Hi there! What can I do for you?",
            "how are you": "I'm fine, I'm here to help! How can I assist you?",
            "manage companies": "You can add, edit, and remove companies in the 'Manage Companies' section.",
            "products": "You can view and manage products linked to companies.",
            "purchase": "To record a purchase, go to 'Purchase Records' and enter the required details.",
            "stock": "The 'Available Stock' section shows current stock levels.",
            "order booker": "Order bookers are responsible for sales. You can manage them in 'Order Booker Management'.",
            "customers": "Customers can be managed under 'Customer Management'.",
            "sales": "Sales transactions are recorded under 'Sales Management'.",
            "recovery": "Customer recovery transactions are recorded under 'Recovery Management'.",
            "reports": "Reports can be generated and printed from the 'Reports' section."
        };
        
        function sendMessage() {
            let userOriginalMessage = $("#user-input").val();
            let userMessage = $("#user-input").val().toLowerCase().trim();
            if (!userMessage) return;
        
            $("#user-input").val("");
            $("#chatbox").append(`<div class='message user'>${userOriginalMessage}</div>`);
        
            let response = "I'm sorry, but I can only assist with questions related to the system functionalities.";
        
            for (let key in responses) {
                if (userMessage.includes(key)) {
                    response = responses[key];
                    break;
                }
            }
        
            setTimeout(() => {
                $("#chatbox").append(`<div class='message bot'>${response}</div>`);
                $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
            }, 500);
        }
        
        $("#input-container").submit(function(event) {
            event.preventDefault();
            sendMessage();
        });

        function clearChat() {
            $("#chatbox").empty();
        }

        function showWelcomeMessage() {
            $("#chatbox").append(`<div class='message bot'>Assalam u Alaikum! How can I assist you today?</div>`);
        }

        // popup
        var PopupBox = $("#message-popup");
    
        $("#close-message-popup").click(
            function()
            {
                ClosePopup();
            }
        );

        $("#close-forget-password-popup").click(
            function()
            {
                CloseForgetPasswordPopup();
            }
        );

        $("#message-popup-button").click(
            function()
            {
                ClosePopup();
            }
        );
        
        function OpenPopup(icon, header, description) {
            document.body.classList.add("no-scroll");
            $("#popup-header-icon").attr('src',icon);
            $("#popup-header-title").text(header);
            $("#popup-description").text(description);
            PopupBox.addClass("show");
        }
            
        function ClosePopup() {
            document.body.classList.remove("no-scroll");
            PopupBox.removeClass("show");
        }

        function OpenVerificationPopup(email) {
            document.body.classList.add("no-scroll");
            $("#popup-description-email").text(email);
            $("#verification-popup").addClass("show");
        }

        function CloseVerificationPopup() {
            document.body.classList.remove("no-scroll");
            $("#verification-popup").removeClass("show");
        }

        function OpenForgetPasswordPopup() {
            document.body.classList.add("no-scroll");
            $("#forget-password-popup").addClass("show");
        }

        function CloseForgetPasswordPopup() {
            document.body.classList.remove("no-scroll");
            $("#forget-password-popup").removeClass("show");
        }

        // feedback
        $("#feedback-form").submit(function(event) {
            event.preventDefault();
            OpenPopup(
                "assets/icons/success.svg",
                "Feedback Received Successfully!",
                "Thank you for sharing your thoughts! Our team values your feedback and will use it to enhance our services."
            );
        });

        // credentials
        var LoginCredentialsPanel = $("#login-credentials-panel");
        $("#login-button").click(
            function()
            {
                OpenCredentials(LoginCredentialsPanel);
            }
        );

        $("#close-login-section").click(
            function()
            {
                $('#login-form')[0].reset();
                DefaultPasswordField($('#toggle-login-password'), $('#login-password'));
                CloseCredentials(LoginCredentialsPanel);
            }
        );

        function OpenCredentials(CredentialsPanel) {
            $('.menu').removeClass("show"); 
            $('.menu-button').removeClass("open");

            document.body.classList.add("no-scroll");
            CredentialsPanel.addClass("show");
        }

        function CloseCredentials(CredentialsPanel) {
            document.body.classList.remove("no-scroll");
            CredentialsPanel.removeClass("show");
        }

        var SignupCredentialsPanel = $("#signup-credentials-panel");
        $("#signup-button").click(
            function()
            {
                OpenCredentials(SignupCredentialsPanel);
            }
        );
        
        $("#get-started-now-button").click(
            function()
            {
                OpenCredentials(SignupCredentialsPanel);
            }
        );

        $("#close-signup-section").click(
            function()
            {
                $('#signup-form')[0].reset();
                $('#circular-image-src').attr('src', "assets/images/profile_placeholder.png");
                DefaultPasswordField($('#toggle-signup-password'), $('#signup-password'));
                CloseCredentials(SignupCredentialsPanel);
            }
        );

        // profile image
        $('.circular-image').click(
            function (e) {
                e.preventDefault();
                $('#image-upload-input').click();
            }
        );
    
        $('#image-upload-input').on('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    $('#circular-image-src').attr('src', event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // default password field
        function DefaultPasswordField(toggleIcon, passwordField)
        {
            passwordField.attr('type', 'password');
            toggleIcon.attr('src', 'assets/icons/hide.svg');
        }

        // signup
        $('#toggle-signup-password').on('click', function () {
            const passwordInput = $('#signup-password');
            const isPassword = passwordInput.attr('type') === 'password';
            passwordInput.attr('type', isPassword ? 'text' : 'password');
            $(this).attr('src', isPassword ? 'assets/icons/show.svg' : 'assets/icons/hide.svg');
        });

        $('#login-button-from-signup').click(
            function (e) {
                e.preventDefault();
                var SignupCredentialsPanel = $("#signup-credentials-panel");
                CloseCredentials(SignupCredentialsPanel);
                var LoginCredentialsPanel = $("#login-credentials-panel");
                OpenCredentials(LoginCredentialsPanel);
            }
        );

        function readImageAsBytes(file, callback) {
            const reader = new FileReader();
            reader.onload = function (e) {
              const arrayBuffer = e.target.result;
              const bytes = new Uint8Array(arrayBuffer);
              callback(bytes);
            };
            reader.readAsArrayBuffer(file);
        }

        function uint8ArrayToBase64(imageBytes) {
            let binary = '';
            const bytes = new Uint8Array(imageBytes);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);  // Base64 encoding
        }
        

        function startEmailVerificationChecker(userEmail, callback) {
            var intervalMs = 3000;
            OpenVerificationPopup(userEmail);
            const checkInterval = setInterval(() => {
                const user = auth.currentUser;
                if (user) {
                    user.reload().then(() => {
                        if (user.emailVerified) {
                            clearInterval(checkInterval);
                            callback(true);
                        }
                    }).catch((error) => {
                        clearInterval(checkInterval);
                        callback(false);
                        CloseVerificationPopup();
                        OpenPopup(
                            "assets/icons/failed.svg",
                            "Error",
                            `Something went wrong!, please try again later. 33 ${error}`
                        );
                    });
                } else {
                    clearInterval(checkInterval);
                    callback(false)
                    CloseVerificationPopup();
                    OpenPopup(
                        "assets/icons/failed.svg",
                        "Error",
                        "Something went wrong!, please try again later."
                    );
                }
            }, intervalMs);
        }

        function createUser(email, password, callback) {
            auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.sendEmailVerification()
                .then(() => {
                    callback(1);
                })
                .catch((error) => {
                    if (error.code == 'auth/network-request-failed') {
                        callback(3);
                    }
                    else {
                        callback(2);
                    }
                });
    
            })
            .catch((error) => {
                if (error.code == 'auth/network-request-failed') {
                    callback(3);
                }
                else if (error.code == 'auth/email-already-in-use') {
                    callback(4);
                }
                else {
                    callback(2);
                }
            });
        }
        
        $("#signup-form").submit(function(event) {
            event.preventDefault();

            let userName = $("#signup-name").val().trim();
            let userEmail = $("#signup-email").val().toLowerCase().trim();
            let userPassword = $("#signup-password").val().trim();

            const file = $('#image-upload-input')[0].files[0];
            readImageAsBytes(file, function(imageBytes) {

                createUser(
                    userEmail,
                    userPassword,

                    function(success) {
                        if (success == 1)
                        {
                            db.collection("Users").doc(userEmail).set({
                                name: userName,
                                email: userEmail,
                                image: uint8ArrayToBase64(imageBytes)
                            })
                            .then(() => {
                                startEmailVerificationChecker(
                                    userEmail,
                                    function(success)
                                    {
                                        if(success)
                                        {
                                            var SignupCredentialsPanel = $("#signup-credentials-panel");
                                            CloseCredentials(SignupCredentialsPanel);
                                            
                                            localStorage.setItem("UserID", userEmail);
                                            CloseVerificationPopup();
                                            window.location.replace("app/app.html");
                                        }
                                    }
                                );
                            })
                            .catch((_) => {
                                OpenPopup(
                                    "assets/icons/failed.svg",
                                    "Error",
                                    "Something went wrong!, please try again later."
                                );
                            });
                        }
                        else if (success == 4)
                        {
                            OpenPopup(
                                "assets/icons/failed.svg",
                                "Error",
                                "This email already have an account, please use different one for login."
                            );
                        }
                        else if (success == 3)
                            {
                                OpenPopup(
                                    "assets/icons/failed.svg",
                                    "Network failed",
                                    "Check your internet connection and try again."
                                );
                            }
                        else
                        {
                            OpenPopup(
                                "assets/icons/failed.svg",
                                "Error",
                                "Something went wrong!, please try again later."
                            );
                        }
                    }
                );

            });
        });

        // login
        $('#toggle-login-password').on('click', function () {
            const passwordInput = $('#login-password');
            const isPassword = passwordInput.attr('type') === 'password';
            passwordInput.attr('type', isPassword ? 'text' : 'password');
            $(this).attr('src', isPassword ? 'assets/icons/show.svg' : 'assets/icons/hide.svg');
        });

        $('#signup-button-from-login').click(
            function (e) {
                e.preventDefault();
                var LoginCredentialsPanel = $("#login-credentials-panel");
                CloseCredentials(LoginCredentialsPanel);
                var SignupCredentialsPanel = $("#signup-credentials-panel");
                OpenCredentials(SignupCredentialsPanel);
            }
        );

        $('#forget-password-button').click(
            function (e) {
                e.preventDefault();
                OpenForgetPasswordPopup();
            }
        );

        function loginUser(email, password, callback) {

            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
    
                if (user.emailVerified) {
                    callback(1);
                } else {
                    user.sendEmailVerification()
                    .then(() => {
                        callback(2);
                    })
                }
            })
            .catch((error) => {
                const errorCode = error.code;
    
                if (errorCode == 'auth/user-not-found' || errorCode == 'auth/invalid-password') {
                    callback(3);
                }
                else if (errorCode == 'auth/network-request-failed') {
                    callback(4);
                }
                else {
                    callback(5);
                }
            });
        }

        $("#forget-password-form").submit(function(event) {
            event.preventDefault();
            let userEmail = $("#forget-password-email").val().toLowerCase().trim();
            firebase.auth().sendPasswordResetEmail(userEmail)
            .then(() => {
                CloseForgetPasswordPopup();
            })
            .catch((error) => {
                CloseForgetPasswordPopup();
                const errorCode = error.code;

                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
                    OpenPopup(
                        "assets/icons/failed.svg",
                        "Login failed",
                        "Invalid email, please enter valid email for reset password"
                    );
                } else if (errorCode === 'auth/network-request-failed') {
                    OpenPopup(
                        "assets/icons/failed.svg",
                        "Network failed",
                        "Check your internet connection and try again."
                    );
                } else {
                    OpenPopup(
                        "assets/icons/failed.svg",
                        "Error",
                        "Something went wrong!, please try again later."
                    );
                }
            });
        });

        $("#login-form").submit(function(event) {
            event.preventDefault();

            let userEmail = $("#login-email").val().toLowerCase().trim();
            let userPassword = $("#login-password").val().trim();

            loginUser(
                userEmail,
                userPassword,
                
                function(success) {
                    if (success == 1) {
                    
                        var LoginCredentialsPanel = $("#login-credentials-panel");
                        CloseCredentials(LoginCredentialsPanel);
                        
                        localStorage.setItem("UserID", userEmail);
                        window.location.replace("app/app.html");
                    }
                    else if (success == 2)
                    {
                        startEmailVerificationChecker(
                            userEmail,
                            function(success)
                            {
                                if(success)
                                {
                                    var LoginCredentialsPanel = $("#login-credentials-panel");
                                    CloseCredentials(LoginCredentialsPanel);
                                    
                                    localStorage.setItem("UserID", userEmail);
                                    window.location.replace("app/app.html");
                                }
                            }
                        );
                    }
                    else if (success == 3)
                    {
                        OpenPopup(
                            "assets/icons/failed.svg",
                            "Login failed",
                            "Incorrect email and password, please double check and try again."
                        );
                    }
                    else if (success == 4)
                    {
                        OpenPopup(
                            "assets/icons/failed.svg",
                            "Network failed",
                            "Check your internet connection and try again."
                        );
                    }
                    else
                    {
                        OpenPopup(
                            "assets/icons/failed.svg",
                            "Error",
                            "Something went wrong!, please try again later."
                        );
                    }
                }
            );
        });

    }
);

document.addEventListener("DOMContentLoaded", function () {
    var cursor = document.querySelector('.blob');

    document.addEventListener('mousemove', function(e){
      var x = e.clientX;
      var y = e.clientY;
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
    });

    var rightToLeftSwiper = new Swiper(".swiper1", {
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        breakpoints: {
            930: {
                slidesPerView: 2,
            }
        }
    });

    // right to left swiper
    function rightToLeftStopAutoPlay()
    {
        const swiperTranslate = rightToLeftSwiper.getTranslate();
        rightToLeftSwiper.setTranslate(swiperTranslate);
        rightToLeftSwiper.autoplay.stop();
        rightToLeftSwiper.update();
    }
    function rightToLeftStartAutoPlay()
    {
        rightToLeftSwiper.slideTo(rightToLeftSwiper.activeIndex, 3000, false);
        rightToLeftSwiper.autoplay.start();
        rightToLeftSwiper.update();
    }

    document.querySelector(".swiper1").addEventListener("mouseenter", () => rightToLeftStopAutoPlay());
    document.querySelector(".swiper1").addEventListener("mouseleave", () => rightToLeftStartAutoPlay());

    // left to right swiper
    var leftToRightSwiper = new Swiper(".swiper2", {
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            reverseDirection: true
        },
        breakpoints: {
            930: {
                slidesPerView: 2,
            }
        }
    });

    // right to left swiper
    function leftToRightStopAutoPlay()
    {
        const swiperTranslate = leftToRightSwiper.getTranslate();
        leftToRightSwiper.setTranslate(swiperTranslate);
        leftToRightSwiper.autoplay.stop();
        leftToRightSwiper.update();
    }
    function leftToRightStartAutoPlay()
    {
        leftToRightSwiper.slideTo(leftToRightSwiper.activeIndex, 3000, false);
        leftToRightSwiper.autoplay.start();
        leftToRightSwiper.update();
    }

    document.querySelector(".swiper2").addEventListener("mouseenter", () => leftToRightStopAutoPlay());
    document.querySelector(".swiper2").addEventListener("mouseleave", () => leftToRightStartAutoPlay());
});
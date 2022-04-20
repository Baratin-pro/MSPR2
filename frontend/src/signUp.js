const signUp = {
    formValid : document.getElementById("submitSignUp"),
    form : document.querySelector("#form"),
    inputsForm :{
        //Input element
        email : document.getElementById("email"), // Email
        password : document.getElementById("password"), // Password
        //ValueInput
        inputEmail : function(){ return this.email.value},
        inputPassword : function(){ return this.password.value}
    },
    passwordValidLength: document.getElementById("passwordValidLength"),
    passwordValidUppercase: document.getElementById("passwordValidUppercase"),
    passwordValidLowercase: document.getElementById("passwordValidLowercase"),
    passwordValidNumber: document.getElementById("passwordValidNumber")
}
signUp.inputsForm.password.addEventListener('input',(e) => {
    signUp.passwordValidLength.style.color = 'red';
    signUp.passwordValidUppercase.style.color = 'red';
    signUp.passwordValidLowercase.style.color = 'red';
    signUp.passwordValidNumber.style.color = 'red';
    if (signUp.inputsForm.inputPassword().length >= 8 && signUp.inputsForm.inputPassword().length < 32) {
        signUp.passwordValidLength.style.color = 'green';
        if (/[A-Z]/.test(signUp.inputsForm.inputPassword())) {
            signUp.passwordValidUppercase.style.color = 'green';
        }
        if (/[a-z]/.test(signUp.inputsForm.inputPassword())) {
            signUp.passwordValidLowercase.style.color = 'green';
        }
        if (/[0-9]/.test(signUp.inputsForm.inputPassword())) {
            signUp.passwordValidNumber.style.color = 'green';
        }
    }
})
signUp.formValid.addEventListener('click', (e) => {
    if (signUp.inputsForm.email) {
        if (signUp.inputsForm.email.validity.valueMissing) {
                e.preventDefault()
        }
    }
    if (signUp.inputsForm.password) {
        if (!signUp.inputsForm.password.validity.valueMissing) {
            if (signUp.inputsForm.inputPassword().length < 8 || signUp.inputsForm.inputPassword().length > 32) {
                signUp.passwordValidLength.style.color = 'red';
                e.preventDefault();
            }
            if (!/[A-Z]/.test(signUp.inputsForm.inputPassword())) {
                signUp.passwordValidUppercase.style.color = 'red';
                e.preventDefault();
            }
            if (!/[a-z]/.test(signUp.inputsForm.inputPassword())) {
                signUp.passwordValidLowercase.style.color = 'red';
                e.preventDefault();
            }
            if (!/[0-9]/.test(signUp.inputsForm.inputPassword())) {
                signUp.passwordValidNumber.style.color = 'red';
                e.preventDefault();
            }
        }
    }
})

signUp.form.addEventListener('submit', async (e)=>{ 
    console.log('Envoyé');
    e.preventDefault()
    //Send to API
    try{
        fetch(signUp.form.getAttribute('action'),{
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }), 
            body: JSON.stringify({
                email: signUp.inputsForm.inputEmail(),
                password: signUp.inputsForm.inputPassword()
            })
        }).then(()=> {
            window.location.href="../index.html"; 
        })
    }catch(e){
            console.log(e)
        } 
    })
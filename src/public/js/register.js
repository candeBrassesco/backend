const registerForm = document.getElementById("registerForm")

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(registerForm);
    const obj = {};
    data.forEach( (value, key) => obj[key] = value);
    fetch('/api/session/register', {
        method:'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application.json'
        }
    }).then( res => res.json() ).then( json => console.log(json) )
})
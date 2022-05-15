const { ipcRenderer } = require('electron')

let btnlogin;
let full_name; 
let password;

window.onload = function() { 
  full_name = document.getElementById("full_name")
  password = document.getElementById("password")
  btnlogin = document.getElementById("login")

  btnlogin.onclick = function(){
    
   const obj = {full_name:full_name.value, password:password.value }

    ipcRenderer.invoke("login", obj)
  }
}


const { ipcRenderer } = require('electron')

let mylist;
let id;
let full_name;
let elector_number;
let group;
let bi;
let signature;
let btnform;
let btnUpdate;
let btndelete;
let btnedit;
/*document.addEventListener("DOMContentLoaded", function() {
 })*/

window.onload = function() { 
   
   mylist = document.getElementById("mylist") 
   btnform = document.getElementById("btnform")
   btnUpdate = document.getElementById("btnUpdate")
   idproduct = document.getElementById("idproduct")
   full_name = document.getElementById("full_name")
   elector_number = document.getElementById("elector_name")
   group = document.getElementById("group")
   bi = document.getElementById("bi")
   signature = document.getElementById("signature")
   btnform.onclick = renderAddProduct  
   btnUpdate.onclick = renderUpdateProduct 
   renderGetProducts() 
};


async function renderGetProducts() 
{
   await ipcRenderer.invoke('get')   
}

async function renderAddProduct() 
{
   const obj = {
      full_name:full_name.value,
      elector_number: elector_number.value,
      group: group.value,
      bi: bi.value,
      signature: signature.value,
   }
      full_name = ""
      elector_number = ""
      group = ""
      bi = ""
      signature = ""
   await ipcRenderer.invoke('add', obj)  
  
   new Notification('Eleitores', {
      body: 'eleitor cadastrado'
    })
}


ipcRenderer.on('elector', (event, results) => {  
   let template = ""
   const list = results
   list.forEach(element => {
      template+=`
         <tr>
            <td>${element.full_name}</td>
            <td>${element.elector_number}</td>
            <td>${element.group}</td>
            <td>${element.bi}</td>
            <td>${element.signature}</td>
            <td>
              <button class="btn btn-danger"
                value="${element.id}"
                > 
                delete
              </button>
             </td>
             
             <td>
               <button class="btn btn-info"   
                 id="btnedit"
                 value="${element.id}"> 
                edit
              </button>
           
            </td>
         </tr>
      ` 
   });
     
   mylist.innerHTML = template 
   btndelete = document.querySelectorAll(".btn-danger")
   btndelete.forEach(boton =>{
     boton.addEventListener("click" , renderdeleteproduct)
  })

 btnedit = document.querySelectorAll(".btn-info")
 btnedit.forEach(boton =>{
    boton.addEventListener("click" , rendergetproduct)
 })

});


async function renderdeleteproduct(e)
{
  
   const obj = { id:parseInt(e.target.value)}
   await ipcRenderer.invoke('remove_product', obj)    
}

async function rendergetproduct(e)
{
   const obj = { id: parseInt(e.target.value)}
   await ipcRenderer.invoke("get_one" , obj)

}

ipcRenderer.on('elector', (event, result) => {
   id.value = result.id
   full_name.value = result.full_name
   elector_number.value = result.elector_number
   group.value = result.group
   bi.value = result.bi
   signature.value = result.signature
});

async function renderUpdateProduct()
{
  const obj = {
     id: id.value,
     full_name: full_name.value,
     elector_number: elector_number.value,
     group: group.value,
     bi: bi.value,
     signature: signature.value,
  }

  clearinput()
  await ipcRenderer.invoke("update" , obj)
}

function clearinput()
{
   id.value =""
   full_name.value = ""
   elector_number.value = ""
   group.value = ""
   bi.value = ""
   signature.value = ""
}

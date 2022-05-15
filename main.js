const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path'); 
let db = require('./database')

let win;
let winlogin;
function createWindow () {
   win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
     // nodeIntegration: true,
     // contextIsolation:true,
     // devTools:false,
      preload:path.join(__dirname, 'index.js')
      
    }
  })

  win.loadFile('index.html')
}

function loginWindow () {
  winlogin = new BrowserWindow({
   width: 800,
   height: 600,
   webPreferences: {
    // nodeIntegration: true,
    // contextIsolation:true,
    // devTools:false,
     preload:path.join(__dirname, 'login.js')
     
   }
 })

 winlogin.loadFile('login.html')
}



app.whenReady().then(loginWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('login', (event, obj) => {
  validatelogin(obj)
});


function validatelogin(obj) {
 const {  full_name, password } = obj 
 const sql = "SELECT * FROM user WHERE full_name=? AND password=?"
  db.query(sql, [ full_name, password], (error, results, fields) => {
    if(error){ console.log(error);}

    if(results.length > 0){
       createWindow ()
       win.show()
       winlogin.close()
     }else{
       new Notification({
         title:"login",
         body: 'Credências errada, tente novamente'
       }).show()
     }
    
  });
}



ipcMain.handle('get', () => {
   getProducts()
});


ipcMain.handle('add', (event, obj) => {
  addProduct(obj)
});


ipcMain.handle('get_one', (event, obj) => {
  getproduct(obj)    
});


ipcMain.handle('remove_product', (event, obj) => {
  deleteproduct(obj)
});


ipcMain.handle('update', (event, obj) => {
  updateproduct(obj)    
});


function getProducts()
{
  
  db.query('SELECT * FROM elector', (error, results, fields) => {
    if (error){
      console.log(error);
    }
    
    win.webContents.send('electors', results)
  });  
}


function addProduct(obj)
{
  const sql = "INSERT INTO elector SET ?";  
  db.query(sql, obj, (error, results, fields) => {
    if(error) {
       console.log(error);
    }
    getProducts()  
 });
}


function deleteproduct(obj)
{
  const { id }  = obj
  const sql = "DELETE FROM elector WHERE id = ?"
  db.query(sql, id, (error, results, fields) => {
    if(error) {
       console.log(error);
    }
    getProducts()  
  });
}


function getproduct(obj)
{
  let { id } = obj 
  let sql = "SELECT * FROM elector WHERE id = ?"
  db.query(sql, id, (error, results, fields) => {
    if (error){
      console.log(error);
    }
    console.log(results)
    win.webContents.send('elector', results[0])
  });
}


function updateproduct(obj) 
{
   let { id, full_name, elector_number, group, bi, signature } = obj
   const sql = "UPDATE elector SET full_name=?, elector_number=? group=?, bi=?, signature=?, WHERE id=?";  
   db.query(sql, [id, full_name, elector_number, group, bi, signature], (error, results, fields) => {
     if(error) {
        console.log(error);
     }
     getProducts()  
   });
}



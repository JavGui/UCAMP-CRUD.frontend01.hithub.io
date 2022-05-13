import React, { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState(""); 
  const [captura, setCaptura] = useState("");
  const [busqueda, setbusqueda] = useState([]);
  const [mensaje, setMensaje] = useState(false);

  function handleChange(e){
    setCaptura (e.target.value);
    setNuevoNombre("");
    setMensaje(" ");
  }

  function handleChangeDos(e){
    setNuevoNombre (e.target.value);
    setMensaje(" ");
  }

  useEffect(() => { 
    fetch('http://localhost:5000/usuarios')
    .then(respuesta => respuesta.json())
    .then(usuario => setbusqueda(usuario))
  }, []);
  
  async function handleSubmit(){
    setId("");
    setNombre("");
    if(captura !== ""){
      await fetch('http://localhost:5000/usuarios')
      .then(respuesta => respuesta.json())
      .then(usuario => setbusqueda(usuario))
      if (busqueda.length > 0){ 
        setMensaje("Este nombre no se encuentra en la Base de Datos")
        busqueda.map((dato) => {
          if (dato.nombre === captura){
            setId(dato.id);
            setNombre(dato.nombre);
            setMensaje(" ")
          }
          return (id, nombre);
        })
      } else{
        setMensaje("Este nombre no se encuentra en la Base de Datos");
      }
    }else {
      setMensaje("Debe capturar un nombre antes de pulsar algún botón");
    }
  }  

  async function handleCreate() {
    setId("");
    setNombre("");
    if(captura !== ""){
      await fetch('http://localhost:5000/usuarios')
      .then(respuesta => respuesta.json())
      .then(usuario => setbusqueda(usuario))
      if (busqueda.length > 0){ 
        let verdadero = false;
        busqueda.map((dato) => {
          if (dato.nombre === captura){
            verdadero = true;
            setMensaje("Este nombre ya existe en la Base de Datos");
          }
          return (id, nombre);
        })
        if (verdadero === false){ 
          AgregaRegistro(captura);        
        }else {
          setId("");
          setNombre("");
        }
      }else {
        AgregaRegistro(captura);  
      }
    }else {
      setMensaje("Debe capturar un nombre antes de pulsar algún botón");
    }
  }

  function AgregaRegistro(nombreCapturado){
    const arreglo = {nombre: nombreCapturado};
    try{
      fetch("http://localhost:5000/usuarios", { 
        method: "POST", 
        headers: { "Content-Type" : "application/json" }, 
        body: JSON.stringify(arreglo)
      }).then(respuesta => {return respuesta.json()})
        .then(res => {setbusqueda(res)})

        setMensaje("Se grabó el nombre con éxito");
    }
    catch (error) {
      setMensaje(`Error: ${error}`);
    }    
  }

  async function handleDelete(){
    if(captura !== ""){
      if (id !== "") {
        BorraRegistro(id);     
      }else {
        setMensaje("Debe Buscar el nombre y si existe, entonces orpima Borrar");  
      }         
    }else {
      setMensaje("Debe capturar un nombre antes de pulsar algún botón");
    }
  }

  function BorraRegistro(idCapturado){
    const arreglo = {id: idCapturado};
    try{
      fetch("http://localhost:5000/usuarios", { 
        method: "DELETE", 
        headers: { "Content-Type" : "application/json" }, 
        body: JSON.stringify(arreglo)
      }).then(respuesta => {return respuesta.json()})
        .then(res => {setbusqueda(res)})
        setMensaje("Se borró el Usuario con éxito");
        setId("");
        setNombre("");
    }
    catch (error) {
          setMensaje(`Error: ${error}`);
    }  
  }

  async function handleModify(){
    if(captura !== ""){
      if (id !== "") {
        if(nuevoNombre !== ""){
          console.log("Voy a modificar el nombre");
          console.log("nuevoNombre: ", nuevoNombre);
          ModificaRegistro(id);    
        }else {
          setMensaje("Debe capturar el nuevo nombre");
        }
      }else {
        setMensaje("El nombre a modificar debe existir en la Base de Datos");  
      }         
    }else {
      setMensaje("Debe Buscar el nombre y si existe, entonces oprimir Modificar")
    }
  }

  function ModificaRegistro(idCapturado){
    const arreglo = {id: idCapturado, nombre: nuevoNombre};
    try{
      fetch("http://localhost:5000/usuarios", { 
        method: "PUT", 
        headers: { "Content-Type" : "application/json" }, 
        body: JSON.stringify(arreglo)
      }).then(respuesta => {return respuesta.json()})
        .then(res => {setbusqueda(res)})
        setMensaje("Se modificó el nombre con éxito");
        setId("");
        setNombre("");
    }
    catch (error) {
          setMensaje(`Error: ${error}`);
    }  
  }
  
  return(
    <div className="App">
      <div className="captura">
        <div className="input">
            <label>Nombre: </label>
            <input type="text" onChange={ handleChange }/>
        </div>

        <div className="botones">
            <div>
              <button className="botonEstilo busca" type="button" onClick={ ()=>handleSubmit() } >Buscar</button>
            </div>
            <div>
              <button className="botonEstilo agrega" type="button" onClick={ ()=>handleCreate() } >Agregar</button>
            </div>
            <div>
              <button className="botonEstilo borra" type="button" onClick={ ()=>handleDelete() } >Borrar</button>
            </div>
            <div>
              <button className="botonEstilo cambia" type="button" onClick={ ()=>handleModify() } >Modificar</button>
            </div>
        </div>
      </div>

      <div className="modifica">
        <div className="muestra">
          <ul className="datos">
              <li className='id'>Id: { id }</li>
              <li className='nombre'>Nombre: { nombre }</li>
          </ul>
        </div>
        <div className="inputCambia">
            <div className="nuevoNombre">
              <label>Nuevo nombre: </label>
              <input type="text" value={ nuevoNombre} onChange={ handleChangeDos }/>
            </div>
        </div>
      </div>

      <div className="mensaje">
         <p className="texto">{mensaje}</p>
      </div>
      <br/>
      <hr/>
      <div className="usuarios">
          <h3>Lista de Usuarios</h3>
          <div className="lista">
            <ul className="listaUsuarios">
              {busqueda && busqueda.map((el) => 
              { return <li key={el.id}>{el.id} - { el.nombre }</li>})}
            </ul>
          </div>
      </div>
    </div>
  )
}

export default App;
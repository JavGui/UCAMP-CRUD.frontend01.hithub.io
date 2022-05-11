import React, { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState(""); 
  const [captura, setCaptura] = useState("");
  const [busqueda, setbusqueda] = useState([]);
  const [existe, setExiste] = useState(false);
  const [mensaje, setMensaje] = useState(false);

  function handleChange(e){
    setCaptura (e.target.value);
    setMensaje(" ");
  }

  useEffect(() => { 
    fetch('http://localhost:5000/usuarios')
    .then(respuesta => respuesta.json())
    .then(usuario => setbusqueda(usuario))
    console.log(busqueda);
  }, []);
  
  async function handleSubmit(){
    console.log("Entro a submit");
    setId("");
    setNombre("");

    if(captura !== ""){
      console.log("Entro a leer");
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
        setMensaje("No se cargaron datos");
      }
    }else {
      setMensaje("Debe capturar un nombre antes de pulsar algún botón");
    }
  }  

  async function handleCreate()
  {
    console.log("Entro a crear")
    setId("");
    setNombre("");

    if(captura !== ""){
      console.log("Entro a leer")
      await fetch('http://localhost:5000/usuarios')
      .then(respuesta => respuesta.json())
      .then(usuario => setbusqueda(usuario))

      if (busqueda.length > 0){ 
        setExiste(false);

        busqueda.map((dato) => {
          if (dato.nombre === captura){
            console.log("Se cumple el if del map");
            setExiste(true);
            console.log("Si existe: ", existe);
            setMensaje("Este nombre ya existe en la Base de Datos");
          }
          return (existe, id, nombre);
        })   

        console.log("Existe: ", existe);

        if (existe === false){ 
          AgregaRegistro(captura);        
        }else {
          setId("");
          setNombre("");
        }
      }else {
        setMensaje("No se cargaron datos");  
      }
    }else {
      setMensaje("Debe capturar un nombre antes de pulsar algún botón");
    }
  }

  function AgregaRegistro(nombreCapturado){
    console.log("Entro a enviar nombre");
    console.log(nombreCapturado);
    const arreglo = {nombre: nombreCapturado};
    // try{
      fetch("http://localhost:5000/usuarios", { 
        method: "POST", 
        headers: { "Content-Type" : "application/json" }, 
        body: JSON.stringify(arreglo)
      }).then(respuesta => {return respuesta.json()})
        .then(res => {setbusqueda(res)})

        // setMensaje("Se envió el nombre con éxito");
    // }
    // catch (error) {
    //   setMensaje(`Error: ${error}`);
    // }    
  }

  async function handleDelete(){
    console.log("Entro a borrar")
    setId("");
    setNombre("");

    if(captura !== ""){
      if (id !== "") {
        console.log("Entro a borrar")
        BorraRegistro(id);     
      }else {
        setMensaje("El nombre a borrar debe existir en la Base de Datos");  
      }         
    }else {
      setMensaje("Debe buscar el nombre y después pulsar Borrar");
    }
  }

  function BorraRegistro(idCapturado){
    console.log("Entro a enviar id");
    console.log(idCapturado);
    const arreglo = {idCapturado};
    // try{
      fetch("http://localhost:5000/usuarios", { 
        method: "POST", 
        headers: { "Content-Type" : "application/json" }, 
        body: JSON.stringify(arreglo)
      }).then(respuesta => {return respuesta.json()})
        .then(res => {setbusqueda(res)})
  }

  return(
    <div className="App">
      <div className="captura">
        <div className="input">
            <label>Nombre: </label>
            {/* <input type="text" value={ nombre } onChange={ handleChange }/> */}
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
        </div>
      </div>

      <div className="muestra">
        <ul className="datos">
            <li className='id'>Id: { id }</li>
            <li className='nombre'>Nombre: { nombre }</li>
        </ul>
      </div>
      <div className="mensaje">
         <p className="texto">{mensaje}</p>
      </div>
      <br/>
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
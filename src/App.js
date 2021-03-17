import React, {useState} from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'


import  {FaCloudSunRain} from 'react-icons/fa'
import  {FaSearch} from  'react-icons/fa'
import  {FaRegSadTear} from 'react-icons/fa'

function App(){
  const [cidade, setCidade] = useState('')
  const [clima, setClima] = useState(null)
  const [erroClima, setErroClima] = useState(null)

  async function obtemClima (cidade){
    const apiWeather = process.env.REACT_APP_APIWEATHER
    let urlClima = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt&units=metric&appid=${apiWeather}`
    await fetch(urlClima)
    
    .then(response => response.json())
    .then(data => { 
      console.log(data)
      data.cod === '404' 
      ? setErroClima('Cidade não encontrada')
      : setClima(data)
    
    })
    .catch(function(error) {
      console.error(`Erro ao obter o clima da cidade:${error.message}`)
    })
  }

  return (  

    <> {/* React Fragment */} 

      <Navbar bg="danger" variant="dark">  
        <Navbar.Brand href="#inicio">FateClima</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#inicio">Início</Nav.Link>
          <Nav.Link href="#contato">Contato</Nav.Link>
        </Nav>
        <Form inline>
          <FaSearch></FaSearch> &nbsp;  <FormControl type ="text" value={cidade}
          onChange={event => setCidade(event.target.value)}
            placeholder="Digite a cidade..."/>&nbsp;
            <Button variant="dark" onClick={()=> obtemClima(cidade)}><FaCloudSunRain/> &nbsp; Obter Clima</Button>
        </Form>
      </Navbar>

      {erroClima &&
      <Toast onClose = {() => setErroClima(null)} delay ={5000} className="bg-danger" autohide="true"> 
        <Toast.Header>
        <strong className="mr-auto">{erroClima}</strong>
        <small><FaRegSadTear/></small>
        </Toast.Header>
        <Toast.Body className= "bg-white text-danger">
          Ah não.. nome da cidade inválida<br></br> 
          Por favor, digite-a novamente!
        </Toast.Body>
      </Toast>
      }


      <Jumbotron>
        <h1><FaCloudSunRain/>FateClima</h1> 
        <p>Consulte o clima de qualquer cidade do mundo. <br></br>
          App desenvolvido em ReactJS e integrado com as API's Opencagedata e OpenWeatherMap

        </p>
     
      </Jumbotron>
      {clima &&
       <p>Cidade: {clima.name} - Temperatura: {clima.main.temp} </p> 
      }

    </>

  

  )
    }
export default App


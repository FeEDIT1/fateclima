import React, {useState, useEffect} from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'


import  {FaCloudSunRain, FaArrowDown, FaArrowUp,FaWindowClose} from 'react-icons/fa'
import  {FaSearch} from  'react-icons/fa'
import  {FaRegSadTear} from 'react-icons/fa'

function App(){
  const [cidade, setCidade] = useState('')
  const [clima, setClima] = useState(null)
  const [erroClima, setErroClima] = useState(null)
  const[erroGeo,setErroGeo] = useState(null)

const listaErrosGeo =[ {"codigo":1, "texto": "Não foi dada permissão para o sistema encontrar a sua localização"},
                       {"codigo":2, "texto": "Não foi possivel obter sua localização"},
                       {"codigo":3, "texto": "O tempo para obter a localização foi expirado!"}
                      ]

  useEffect(() => {

    if('geolocation' in navigator) {
navigator.geolocation.getCurrentPosition(function(position) {
//  console.log(position)
  position.coords && obtemCidade(position.coords.latitude, position.coords.longitude)
},  function(error){
  //console.error(error)
  setErroGeo(error.code)
})

    }

    async function obtemCidade(latitude, longitude) {
      const apikeyGeo = process.env.REACT_APP_APIGEO
      let url=`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apikeyGeo}`
      await fetch(url)
      .then(response => response.json())
      .then(data => {
        //console.log(data)
          setCidade(data.results[0].components.city +','+data.results[0].components.country)

      })
    .catch(function(error){
        console.error(`Erro ao obter a cidade a partir da latitude/longitude: ${error.message}` )

    })

    }

  },[])


  async function obtemClima (cidade){
    const apiWeather = process.env.REACT_APP_APIWEATHER
    let urlClima = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt&units=metric&appid=${apiWeather}`
    await fetch(urlClima)
    
    .then(response => response.json())
    .then(data => { 
      console.log(data)
      switch (data.cod){
        case '401':
          setErroClima('A API Key informada é inválida')
          setClima(null)
          break

          case '404':
            setErroClima('A cidade informada não foi encontrada!')
            setClima(null)
            break

            case '429':
              setErroClima('O uso gratuito foi ultrapassado! (60 chamadas por minuto)')
              setClima(null)
              break

              default:
                setClima(data)
      }
    
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
          <FaSearch></FaSearch> &nbsp;  <FormControl type ="text" value={cidade} onBlur={()=> obtemClima(cidade)}
          onChange={event => setCidade(event.target.value)}
            placeholder="Digite a cidade..."/>&nbsp;

            <Button variant = "outline-dark" onClick={()=> setCidade('')}><FaWindowClose></FaWindowClose></Button>
            <Button variant="dark" disabled = {cidade.length < 3}onClick={()=> obtemClima(cidade)}><FaCloudSunRain/> &nbsp; Obter Clima</Button>
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
      {erroGeo &&
      <Alert variant ="danger" onClose={()=> setErroGeo(null)} dismissible >
        <Alert.Heading>Ops! ocorreu um erro ao obter a sua localização.</Alert.Heading> 
        <p>
        {listaErrosGeo[erroGeo].texto}

        </p>
        </Alert>
}
      {clima &&
    <Row className = "justify-content-center">
      <Card bg ="danger" className = "text-center">
         
          <Card.Header className>
         <h2>{clima.name}</h2>
         <h3>{clima.main.temp} &#8451;</h3>
         <h4>Min: {clima.main.temp_min}&#8451;&nbsp;<FaArrowDown/> -
             máx: {clima.main.temp_max} &#8451;&nbsp;<FaArrowUp/></h4>
          </Card.Header>

        <Card.Body className= "bg-white">
        <Card.Img src={`http://openweathermap.org/img/wn/${clima.weather[0].icon}@4x.png`}
                      title={clima.weather[0].description} />
      <Card.Title className= "text-dark">{clima.weather[0].description}</Card.Title>
        </Card.Body>
            <Card.Footer className="text-light">
            Ultima atualização em: {new Date(clima.dt * 1000).toLocaleString('pt-BR')}

            </Card.Footer>
      </Card>

    </Row>
      }

    </>

  

  )
    }
export default App


import React ,{Component}from 'react';
import {Map,TileLayer,Marker,Popup} from "react-leaflet";
import { Card, Button, CardTitle, CardText } from 'reactstrap';
import { Col, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Joi from 'joi';
import UserLocation from './mappin.svg'
import clientLocation from './client.svg'
import "bootstrap/dist/css/bootstrap.css"
import  L from "leaflet";
import './App.css';

const greenIcon = L.icon({
    iconUrl:UserLocation,
    iconSize:     [50, 81], // size of the icon

    iconAnchor:   [0, 41], // point of the icon which will correspond to marker's location

    popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
});

const clientIcon = L.icon({
    iconUrl:clientLocation,
    iconSize:     [50, 81], // size of the icon

    iconAnchor:   [0, 41], // point of the icon which will correspond to marker's location

    popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
});

const schema = Joi.object().keys({
    name: Joi.string().alphanum().min(1).max(100).required(),
    message: Joi.string().min(1).max(100).required(),
})


const API_URL=window.location.hostname==='localhost'?'http://localhost:5000/api/v1/messages':'prodution url';
class  App extends Component {
    state = {
        location:{
            lat: 51.505,
            lng: -0.09
        },

        zoom: 13,
        userMessage:{
            name:'',
            message:''
        },
        sendingMessage:false,
        sentMessage:false,
        messages:[],
    }

    componentDidMount() {

        fetch(API_URL)
            .then(res => res.json())
            .then(messages => {
                const haveSeenLocation={};
                    messages=messages.reduce((all, message) => {
                        const key=`${message.latitude.toFixed(3)}+${message.longitude.toFixed(3)}`;
                        if(haveSeenLocation[key]){
                            haveSeenLocation[key].otherMessages=haveSeenLocation[key].otherMessages||[];


                            haveSeenLocation[key].otherMessages.push(message);
                        }else{
                            haveSeenLocation[key]=messages;
                            all.push(message)
                        }
                        return all;
                },[])
                this.setState({
                    messages
                })
            })
        navigator.geolocation.getCurrentPosition((position)=>{
            this.setState({
                location: {
                lat:    position.coords.latitude,
                lng: position.coords.longitude
                }
            })

            console.log(position )
        },()=>{
            console.log("oh this is the error ");
            fetch("https://ipapi.co/json")
            .then(res=>res.json())
                .then(location => {
                    console.log(location);
                    this.setState({
                        location: {
                            lat: location.latitude,
                            lng: location.longitude
                        }
                    })
                })
        },()=>{

        })

    }

    formIsValid =()=>{
        const userMessage = {
            name: this.state.userMessage.name,
            message: this.state.userMessage.message,
        }
        const result=Joi.validate(userMessage,schema);
        return result.error && !this.state.haveUserLoction?false:true;
    }

    formSubmitted=(event)=>{
        event.preventDefault();
      //  console.log(this.state.userMessage)

         if(this.formIsValid()){
             this.setState({
                 sendingMessage:true
             });
             fetch(API_URL,{
                 method:'post',
                 headers: {
                     'content-type':'application/json'
                 },
                 body:JSON.stringify({
                         name: this.state.userMessage.name,
                         message: this.state.userMessage.message,
                     latitude:this.state.location.lat,
                     longitude:this.state.location.lng,
                 })
             }).then(res=>res.json())
                 .then(message=>{
                     console.log(message);
                     setTimeout(()=>{
                         this.setState({
                             sendingMessage:false,
                             sentMessage:true
                         })
                     },4000);
                 });
         }
    }
    valueChanged=(event) => {
        const {name,value }=event.target;

        this.setState((prevState) =>({
            userMessage:{
                ...prevState.userMessage,
                [name]:value
            }
        })
        )
    }
    render() {

        const position = [this.state.location.lat, this.state.location.lng]
        return (
            <div className="map">
                <Card body className="message-form">
                    <CardTitle>Welcome to the My site </CardTitle>
                    <CardText>Leave a message with your location !</CardText>
                    {
                        !this.state.sendingMessage&&!this.state.sentMessage && !this.state.haveUserLoction?
                    <Form onSubmit={this.formSubmitted}>
                        <FormGroup row>
                            <Label for="name" >Name</Label>
                            {/*<Col sm={10}>*/}
                            <Input
                                onChange={this.valueChanged}
                                type="text"
                                name="name"
                                id="name"
                                placeholder="enter your name" />
                            {/*</Col>*/}
                        </FormGroup>
                        <FormGroup row>
                            <Label for="message" >Message</Label>
                            {/*<Col sm={10}>*/}
                            <Input
                                onChange={this.valueChanged}
                                type="textarea"
                                name="message"
                                id="message"
                                placeholder="enter your message" />
                            {/*</Col>*/}
                        </FormGroup>
                        <Button type="submit" className="btn btn-primary" color="info" disabled={!this.formIsValid()}>Send</Button>{' '}
                    </Form> :
                            this.state.sendingMessage || this.state.haveUserLoction?
                                <video
                                    autoPlay
                                    loop
                                    src="https://media.giphy.com/media/hWSQvXbDDh8rlnoLOt/giphy.mp4">

                                </video>
                                :<CardText>Thanks for submitting a message</CardText>

                    }
                </Card>
            <Map className="map" center={position} zoom={this.state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {
                    this.state.haveUserLocation?
                    <Marker position={position}
                            icon={greenIcon}>

                    </Marker>:''
                },

                {
                    this.state.messages.map(message =>(
                        <Marker
                            key={message._id}
                            position = {[message.latitude,message.longitude]}
                                icon={clientIcon}>
                            <Popup>
                                <p><em>{message.name}:</em> {message.message}</p>
                                {message.otherMessages?message.otherMessages.map(message =>
                                    <p key={message._id}><em>{message.name}:</em> {message.message}</p>):""}
                            </Popup>
                        </Marker>
                    ))}
                }
            </Map>
            </div>
        )

    }
}
export default App;

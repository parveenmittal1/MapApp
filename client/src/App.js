import React ,{Component}from 'react';
import {Map,TileLayer,Marker,Popup} from "react-leaflet";

import Joi from 'joi';
import UserLocation from './mappin.svg'
import clientLocation from './client.svg'
import "bootstrap/dist/css/bootstrap.css"
import  L from "leaflet";
import './App.css';
import {getMessages,getLocation,sendMessage} from './Api';
import MessageCard from "./messageCard";

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
        getMessages()
            .then(messages =>{
                this.setState({
                    messages
                })
            })


        getLocation()
            .then(location => {
                this.setState({
                    location,
                })
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
             const message={
                 name: this.state.userMessage.name,
                     message: this.state.userMessage.message,
                 latitude:this.state.location.lat,
                 longitude:this.state.location.lng,
             }
             sendMessage(message)
                 .then(message=>{
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
                <MessageCard
                sendingMessage={this.setState.sendingMessage}
                sentMessage={this.setState.sentMessage}
                haveUsersLocation={this.setState.haveUsersLocation}
                formSubmitted={this.formSubmitted}
                valueChanged={this.valueChanged}
                formIsValid={this.formIsValid}
                />

            </div>
        );

    }
}
export default App;

import React from 'react';
import { Card, Button, CardTitle, CardText } from 'reactstrap';
import {  Form, FormGroup, Label, Input } from 'reactstrap';


export default (props)=>{
    return (
        <Card body className="message-form">
            <CardTitle>Welcome to the My site </CardTitle>
            <CardText>Leave a message with your location !</CardText>
            {
                !props.sendingMessage&&!props.sentMessage && !props.haveUserLoction?
                    <Form onSubmit={props.formSubmitted}>
                        <FormGroup row>
                            <Label for="name" >Name</Label>
                            {/*<Col sm={10}>*/}
                            <Input
                                onChange={props.valueChanged}
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
                                onChange={props.valueChanged}
                                type="textarea"
                                name="message"
                                id="message"
                                placeholder="enter your message" />
                            {/*</Col>*/}
                        </FormGroup>
                        <Button type="submit" className="btn btn-primary" color="info" disabled={!props.formIsValid()}>Send</Button>{' '}
                    </Form> :
                    props.sendingMessage || props.haveUserLoction?
                        <video
                            autoPlay
                            loop
                            src="https://media.giphy.com/media/hWSQvXbDDh8rlnoLOt/giphy.mp4">

                        </video>
                        :<CardText>Thanks for submitting a message</CardText>

            }
        </Card>
    );
};

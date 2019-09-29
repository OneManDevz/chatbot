import React, { Component } from 'react';
import axios from 'axios/index';
import Message from './Message';
import _ from 'lodash';
class Chatbot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      currentInput: ''
    };
  }

  async dialogflow_text_query(text) {
    let says = {
      speaks: 'me',
      msg: {
        text: {
          text: text
        }
      }
    };
    this.setState({ messages: [...this.state.messages, says] }); //push new msg into the array
    const res = await axios.post('/api/dialogflow_text_query', { text });

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: 'bot',
        msg: msg
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  async dialogflow_event_query(event) {
    const res = await axios.post('/api/dialogflow_text_query', { event });

    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: 'bot',
        msg: msg
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  renderMessages(messages) {
    if (!_.isNil(messages) && _.size(messages)) {
      return messages.map((message, i) => {
        return (
          <Message
            key={i}
            speaks={message.speaks}
            text={message.msg.text.text}
          />
        );
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <div style={{ height: 400, width: 400, float: 'right' }}>
        <div
          id="chatbot"
          style={{ height: '100%', width: '100%', overflow: 'auto' }}
        >
          <h2>Chatbot tu</h2>
          {this.renderMessages(this.state.messages)}
          <input type="text"></input>
        </div>
      </div>
    );
  }
}
export default Chatbot;

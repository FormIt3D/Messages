//console.log("----------------------------------- loading app.js");

class MessagesApp extends React.Component {
  constructor() {
    super();
    //console.log("MessagesApp constructor");
    const domContainer = document.getElementById('appRoot');
    const appRoot = React.createElement(MessagesRoot, {}, null);
    ReactDOM.render(appRoot, domContainer);
  }
}  // class MessagesApp

class MessagesRoot extends React.Component {
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return React.createElement('div', null,
      React.createElement(Header, {title: "FormIt Messages"})
      ,React.createElement(Messages, {})
    );
}
}  // class MessagesRoot

class Header extends React.Component {
  render()
  {
    const instructions =
    [
      React.createElement('li', {key: "instructions1"}, 'Click on an item to subscribe to the Message'),
      React.createElement('li', {key: "instructions2"}, 'Invoke the action the Message watches for'),
      React.createElement('li', {key: "instructions3"}, 'Watch the console for the message:'),
      React.createElement('ul', {key: "instructions4"}, 
        React.createElement('li', {key: "instructions41"}, 'Windows: Window menu ',">",' Script Output'))
    ];

    let header =
     React.createElement('div', { id: 'Header' },
      React.createElement('h1', null, this.props.title),
      React.createElement('ul', { className: 'instructions' },
      instructions
      ),
      React.createElement('hr', null)
    );
    return header;
  } // render
}  // class Header

class Messages extends React.Component {
  constructor(props)
  {
    super(props);
    this.filterMessages = this.filterMessages.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.getMessages();
  }

  async getMessages()
  {
    this.m_Messages = await window.FormIt.Messaging.GetMessages();
    this.setState( () => { return { filteredMessages: this.m_Messages }; });
  }

  ItemClicked = (event) =>
  {
      //console.log(`Item ${event} was clicked`);
      event.target.classList.toggle('checked');
      //console.log(JSON.stringify(event.target.classList));
      var subscribe = event.target.classList.contains('checked');
      if (subscribe)
      {
        const msgCallback = ((msgText, payload) =>
        {
          // This callback will be invoked whenever the signal is emitted on the C++/QML side.
          FormItInterface.ConsoleLog("(Web Side) msg: " + msgText + " Paylaod: " + JSON.stringify(payload));
        }).bind(this, event.target.innerText);

        //FormItInterface.ConsoleLog("Subscribe: " + event.target.innerText);
        // This will register a listener on the HTML UI side.
        FormItInterface.SubscribeMessage(event.target.innerText, msgCallback);

        //FormItInterface.ConsoleLog("About to call MessagesPluginSubscribe");
        // This will register a listener on the FormIt side.
        FormItInterface.CallMethod("FormItExamplePlugins.Messages.MessagesPluginSubscribe", event.target.innerText);
      }
      else
      {
          // This will unsubscribe a listener on the HTML UI side.
          FormItInterface.UnsubscribeMessage(event.target.innerText);
          // This will unsubscribe a listener on the FormIt side.
          FormItInterface.CallMethod("FormItExamplePlugins.Messages.MessagesPluginUnsubscribeMessage", event.target.innerText);
      }
  }

  filterMessages = (filterText) =>
  {
    this.filterText = filterText;

    // Create the filtered list.
    let filteredMessages = [];
    for( let i = 0; i < this.m_Messages.length; i++ )
    {
      if (!this.filterText || this.m_Messages[i].toLowerCase().includes(this.filterText.toLowerCase()))
      {
        filteredMessages.push(this.m_Messages[i]);
      }
    }

    this.setState( () => { return { filteredMessages: filteredMessages }; });
  };

  render()
  {
    if (this.m_Messages)
    {
      let messages = [];
      for( let i = 0; i < this.state.filteredMessages.length; i++ )
      {
        const msg = this.state.filteredMessages[i];
        messages.push(React.createElement('li', {onClick: (event) => this.ItemClicked(event),
          "key": this.state.filteredMessages[i]}, this.state.filteredMessages[i]));
      }

      return React.createElement('div', { id: 'Messages' },
        React.createElement('label', { htmlFor: "Filter" }, "Filter: "),
        React.createElement('input', { onChange: (event) =>
          this.filterMessages(event.target.value), type: 'text', name: 'Filter' }),
        React.createElement('ul', {className: "FormItMessagesUL",  id: "FormItMessagesUL" }, messages));
    }

    return React.createElement('div', { id: 'Messages' },
      React.createElement('h1', null, "Loading Messages")
    );
  }
}  // class Messages


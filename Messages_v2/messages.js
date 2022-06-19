
if (typeof FormItExamplePlugins == 'undefined')
{
    FormItExamplePlugins = {};
}
if (typeof FormItExamplePlugins.Messages == 'undefined')
{
    FormItExamplePlugins.Messages = {};
}

FormItExamplePlugins.Messages.MessagesPluginUnsubscribeMessage = function(msg)
{
    //console.log("Inside MessagesPluginUnsubscribeMessage.");
    if (typeof FormItExamplePlugins.Messages.MessagesPluginListener != 'undefined' &&
        typeof FormItExamplePlugins.Messages.MessagesPluginListener.listener != 'undefined')
    {
        FormItExamplePlugins.Messages.MessagesPluginListener.listener.UnsubscribeMessage(msg);
        FormItExamplePlugins.Messages.MessagesPluginListener.listener[msg] = undefined;
    }
}

FormItExamplePlugins.Messages.MessagesPluginSubscribe = function(msg)
{
    //console.log("Inside MessagesPluginSubscribe.");

    FormItExamplePlugins.Messages.MessagesPluginListener = {};

    // Create a Message Listener that handles calling the subscribed message handlers.
    if(!(FormItExamplePlugins.Messages.MessagesPluginListener.hasOwnProperty("listener")))
    {
        FormItExamplePlugins.Messages.MessagesPluginListener.listener = FormIt.Messaging.NewMessageListener();
        //console.log("Creating FormItExamplePlugins.Messages.MessagesPluginListener.listener.");
    }

    // Assign the message handling function that will be called for the given message.
    FormItExamplePlugins.Messages.MessagesPluginListener.listener[msg] = function(payload)
    {
        console.log("(FormIt Side) msg: " + msg + " Payload: " + JSON.stringify(payload));
    };
    FormItExamplePlugins.Messages.MessagesPluginListener.listener.SubscribeMessage(msg);

    //console.log("FormIt Side, Subscribing to msg: " + msg);
}

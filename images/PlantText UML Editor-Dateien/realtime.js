var conChat = null;
var conIntel = null;

function disableLoggedInHubs(){
    conChat.stop();
    conIntel.stop();
}
function enableLoggedInHubs(){
    
    //Creates connection with hub
    if(conChat === null) {
        conChat = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub",{ accessTokenFactory: () => user.accesstoken })
            .build();

        conChat.start().then(function () {
            document.getElementById("chat-button").disabled = false;
        }).catch(function (err) {
            return console.error(err.toString());
        });

        document.getElementById("chat-button").addEventListener("click", function (event) {

            //Keep since it can take a while
            $('#loader').show();

            pauseButton("chat-button", "Paused", 5000);

            var user = $('#chat-user-input').text();
            var message = document.getElementById("chat-message-input").value;

            //This send the message
            conChat.invoke("ChatSendMessage", user, message).catch(function (err) {
                return console.error(err.toString());
            });

            event.preventDefault();
        });

        conChat.on("ChatReceiveMessage", function (user, message) {

            if(user != -1) {
                var msg = message.replace(/&/g, "&").replace(/>/g, ">");
                var encodedMsg = user + ": " + msg;
                var li = document.createElement("li");
                li.textContent = encodedMsg;

                var chatMessages = $('#chat-messages-list');
                if (chatMessages.children().length > 50) {
                    chatMessages.find('li:first').remove();
                }

                document.getElementById("chat-messages-list").appendChild(li);

                var element = document.getElementById('chat-scroll-box');
                element.scrollTop = element.scrollHeight;
            }

            $('#loader').hide();
        });
    }
    else{
        conChat.start();
    }
    
    if(conIntel === null) {
        conIntel = new signalR.HubConnectionBuilder()
            .withUrl("/intelligenceHub", {accessTokenFactory: () => user.accesstoken})
            .build();

        conIntel.start().then(function () {
            document.getElementById("intelligence-button").disabled = false;
        }).catch(function (err) {
            return console.error(err.toString());
        });

        document.getElementById("intelligence-button").addEventListener("click", function (event) {

            //Keep since it can take a while
            $('#loader').show();

            pauseButton("intelligence-button", "Paused", 10000);

            var request = document.getElementById("intelligence-request").value;

            conIntel.invoke("IntelligenceSendMessage", request).catch(function (err) {
                return console.error(err.toString());
            });

            event.preventDefault();
        });

        conIntel.on("IntelligenceReceiveMessage", function (response) {

            $("#intelligence-response").val(response);

            $('#loader').hide();
        });
    }    
    else{
        conIntel.start();
    }
}
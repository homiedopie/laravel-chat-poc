((function($, $echo, $axios){
    var chat_item = 'chat-item';
    var chat_list = 'chat-list';
    var chat_user = 'chat-user';
    var $chat_conversation = $('.chat-conversation');
    var $chat_conversation_box = $('.chat-conversation-box');
    var $chat_box = $('.chat-box');
    var active_user_id = typeof global_user !== 'undefined' ? global_user : null;
    var chat_messages = [];

    $(document).ready(function(){
        setupEcho();
        initializeDefaultChannel();
        $('.' + chat_list).on('click', '.' + chat_item + ' > a', function(event){
            event.preventDefault();
            switchChannel($(this).closest('.' + chat_item));
            return false;
        });
        $chat_conversation.on('click', '.chat-message:not(.chat-own) .' + chat_user + '', function(event){
            event.preventDefault();
            addChatMate($(this));
            return false;
        });
        $chat_box.on('click', '#chat-message-send', function(event){
            event.preventDefault();
            console.log('message sent');
            sendMessage();
        });
    });

    var setupEcho = function() {
        console.log('manage echo');
        $echo.private('users.' + active_user_id).notification(function(notification){
            console.log('notification', notification);
            if (notification.type === "App\\Notifications\\NewChannel") {
                console.log('new channel');
                var channel = notification.channel;
                addEchoChatMate(channel, notification.user_id, notification.user_name);
                $echo.private('messages.' + channel).listen('.message-sent', function(data){
                    console.log(channel+' message', data);
                    manageEchoMessages(channel, data);
                });
            }
        });
        $echo.private('messages.global').listen('.message-sent', function(data){
            console.log('message global', data);
            manageEchoMessages('global', data);
        });
        var $chat_list_items = $('.' + chat_list + '.chat-list-user').find('.chat-item');
        $.each($chat_list_items, function(key, value){
            var channel = $(this).data('channel');
            if (typeof channel !== 'undefined') {
                $echo.private('messages.' + channel).listen('.message-sent', function(data){
                    console.log(channel+' message', data);
                    manageEchoMessages(channel, data);
                });
            }
        });
    };
    var manageEchoMessages = function(channel, message) {
        var active_channel = getActiveChannel();
        var current_channel = getChannel(channel);
        console.log("manage echo messages", active_channel, current_channel, current_channel.length, active_channel.is(current_channel));
        if (active_channel.is(current_channel)) {
            addMessage(message);
        } else {
            if (current_channel.length) {
                var messages = current_channel.data('messages');
                messages.push(message);
                current_channel.data('messages', messages);
            }
        }
    };
    var sendMessage = function(){
        var message_content = $chat_box.find('#chat-message-input').val();

        if (!message_content.length) {
            return;
        }

        var to_id = typeof getActiveChannel().data('id') !== 'undefined' ? getActiveChannel().data('id') : null;
        var channel = typeof getActiveChannel().data('channel') !== 'undefined' ? getActiveChannel().data('channel') : null;

        $axios.post('/ajax/chat/send_message', {
                to_id : to_id,
                message: message_content,
                channel: channel
        }).then(function(response) {
            handleMessageResponse(response.data);
        });
    };

    var handleMessageResponse = function(response) {
        if (response.result) {
            $chat_box.find('#chat-message-input').val('');
            makeMessageAlert('success', response.message);
        } else {
            makeMessageAlert('danger', response.message);
        }
    };

    var makeMessageAlert = function(type, message) {
        var html_content = $('<div class="alert alert-'+type+' alert-dismissible" role="alert">' +
            '  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>');
        $chat_box.append($(html_content));
        setTimeout(function(){
            html_content.slideUp(500);
        }, 2000);
    };
    var initializeDefaultChannel = function() {
        var active_channel = getActiveChannel();
        if (active_channel.length) {
            var message_json = typeof active_channel.data('messages') !== 'undefined' ? active_channel.data('messages') : null;
            manageMessages(message_json);
        }
    };

    var getActiveChannel = function() {
        return $('.' + chat_item).filter('.active');
    };

    var getChannel = function(channel) {
        return $('.'+ chat_item +'[data-channel="'+ channel +'"]');
    };

    var manageMessages = function(message_json) {
        cleanConversationBox();
        if (message_json === null) {
            //no action
            return;
        }
        var parsed_messages = typeof message_json === 'object' && message_json.length ? message_json : null;
        $.each(parsed_messages, function(key, value){
            addMessage(value);
        });
    };

    var switchChannel = function(element) {
        //save message object
        saveOldMessages();
        setActiveChannel(element);
    };

    var cleanConversationBox = function() {
        chat_messages = [];
        $chat_conversation.empty();
    };

    var isSameWindow = function(selected_channel) {
        return getActiveChannel().is(selected_channel);
    };
    var setActiveChannel = function(selected_channel) {
        var active_channel = getActiveChannel();

        if (isSameWindow(selected_channel)) {
            console.log('same tab');
            return;
        }

        active_channel.removeClass('active');
        selected_channel.addClass('active');
        var message_json = typeof selected_channel.data('messages') !== 'undefined' ? selected_channel.data('messages') : '[]';
        console.log(typeof message_json);
        manageMessages(message_json);
    };

    var saveOldMessages = function() {
        var active_channel = getActiveChannel();
        active_channel.data('messages', chat_messages);
    };

    var addChatMate = function(element) {
        var $chat_list = $('.' + chat_list + '.chat-list-user');
        var $chat_item = $('<li/>',{
            class: 'list-group-item chat-item',
            'data-id': element.data('id'),
        }).append($('<a/>',{
            'href': '#'
        }).text(element.data('name')));

        if ($chat_list.hasClass('chat-list-empty')) {
            $chat_list.empty();
        }

        $chat_list.append($chat_item);
        setActiveChannel($chat_item);
    };

    var addEchoChatMate = function(channel, user_id, name) {
        var $chat_list = $('.' + chat_list + '.chat-list-user');
        var $chat_item_user = $chat_list.find('.chat-item[data-id="'+user_id+'"]');
        if ($chat_item_user.length) {
            $chat_item_user.data('id', null);
            $chat_item_user.data('channel', channel);

            $chat_item_user.attr('data-id', '');
            $chat_item_user.attr('data-channel', channel);
        } else {
            var $chat_item = $('<li/>',{
                class: 'list-group-item chat-item',
                'data-channel': channel
            }).append($('<a/>',{
                'href': '#'
            }).text(name));

            if ($chat_list.hasClass('chat-list-empty')) {
                $chat_list.empty();
            }
            $chat_list.append($chat_item);
        }
        setActiveChannel($chat_item_user.length ? $chat_item_user : $chat_item);
    };

    var addMessage = function(message_object) {
        var is_own_message = false;
        var message_user_id = message_object.user_id;
        var message_user_name = message_object.name;
        var message_content = message_object.message;

        //save to global variable
        chat_messages.push(message_object);

        if (message_user_id === active_user_id) {
            is_own_message = true;
        }
        var message_element = $('<div/>',{
            class : 'chat-message'
        });
        var message_well = $('<div/>',{
            class : 'well well-sm'
        });

        var message_user_element = $('<div/>',{
            class : 'chat-user',
            'data-id' : message_user_id,
            'data-name' : message_user_name,
        });
        var message_content_element = $('<div/>',{
            class : 'chat-message-content'
        });

        message_user_element.text(is_own_message ? 'Me:' : message_user_name);
        if (is_own_message) {
            message_element.addClass('chat-own');
        }

        message_content_element.text(message_content);
        message_well.append(message_user_element);
        message_well.append(message_content_element);
        message_element.append(message_well);

        $chat_conversation.append(message_element);
        scrollToLatest();
    };

    //debounce animation
    var timeout;
    var scrollToLatest = function() {
        var last_message = $chat_conversation.find('.chat-message:last');
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            console.log('timeout for animation done');
            $chat_conversation_box.animate({
                scrollTop: last_message.offset().top - $chat_conversation_box.offset().top + $chat_conversation_box.scrollTop()
            });
        }, 200);
    }
})(window.$, window.Echo, axios));
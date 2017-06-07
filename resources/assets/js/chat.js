((function($, $echo){
    global_user = 1;
    var chat_item = 'chat-item';
    var chat_list = 'chat-list';
    var $chat_conversation = $('.chat-conversation');
    var $chat_conversation_box = $('.chat-conversation-box');
    var active_user_id = typeof global_user !== 'undefined' ? global_user : null;
    var chat_messages = [];

    $(document).ready(function(){
        var user_messages = [
            {
                'user_id' : 1,
                'name' : 'Miko Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 2,
                'name' : 'Michael Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 2,
                'name' : 'Michael Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 2,
                'name' : 'Michael Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 2,
                'name' : 'Michael Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 1,
                'name' : 'Miko Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 1,
                'name' : 'Miko Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 1,
                'name' : 'Miko Mantos',
                'message': 'Lorem ipsum...'
            },
            {
                'user_id' : 1,
                'name' : 'Miko Mantos',
                'message': 'Lorem ipsum...'
            }
        ];
        initializeDefaultChannel(user_messages);
        $('.' + chat_list).on('click', '.' + chat_item + ' > a', function(event){
            event.preventDefault();
            switchChannel($(this).closest('.' + chat_item));
            return false;
        });
    });

    var initializeDefaultChannel = function(test) {
        var active_channel = getActiveWindow();
        if (active_channel.length) {
            active_channel.data('messages', JSON.stringify(test));
            var message_json = typeof active_channel.data('messages') !== 'undefined' ? active_channel.data('messages') : null;
            manageMessages(message_json);
        }
    };

    var getActiveWindow = function() {
        return $('.' + chat_item).filter('.active');
    };
    var manageMessages = function(message_json) {
        cleanConversationBox();
        if (message_json === null) {
            //no action
            return;
        }
        var parsed_messages = typeof message_json === 'string' && message_json.length ? JSON.parse(message_json) : null;
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
    var setActiveChannel = function(selected_channel) {
        if (active_channel.is(selected_channel)) {
            console.log('same tab');
            return;
        }
        var active_channel = getActiveWindow();
        active_channel.removeClass('active');

        selected_channel.addClass('active');
        var message_json = typeof selected_channel.data('messages') !== 'undefined' ? selected_channel.data('messages') : '[]';
        manageMessages(message_json);
    };
    var saveOldMessages = function() {
        var active_channel = getActiveWindow();
        active_channel.data('messages', JSON.stringify(chat_messages));
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
            class : 'chat-user'
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
})(window.$, window.Echo));
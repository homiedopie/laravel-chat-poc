<?php

namespace App\Http\Controllers;

use App\Channel;
use App\Events\MessageSent;
use App\Message;
use App\Notifications\NewChannel;
use App\User;
use Illuminate\Http\Request;
use Auth;

class ChatController extends Controller
{
    /**
     * ChatController constructor.
     * Set middleware to auth
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Return default chat index page
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        // TODO: refactor later on
        $user_id = Auth::user()->id;
        $user = User::with(['channels' => function($query){
            $query->whereNull('name');
        }, 'channels.messages' => function($query){
            $query->take(50);
        }, 'channels.messages.user', 'channels.users' => function($query) use($user_id) {
            //Exclude our user id and take only 1 for display
            $query->where('user_id', '!=', $user_id);
        }])->where('id', $user_id)->first();

        $chat_list = $this->prepareChannelChatList($user);
        $global_channel = Channel::with(['messages' => function($query){
            $query->take(50);
        }, 'messages.user'])->where('name', 'global')->get()->toArray();

        $global_messages = ($this->prepareChatList($global_channel))[0];
        return view('chat.index', compact('chat_list', 'user_id', 'global_messages'));
    }

    protected function prepareChannelChatList($user)
    {
        if (!isset($user->channels)) {
            return [];
        }
        $channels = $user->channels->toArray();
        return $this->prepareChatList($channels);
    }

    protected function prepareChatList($channels = null)
    {
        $chat_list = [];
        foreach($channels as $channel) {
            $chat_item = [];
            if (!empty($channel['hash'])) {
                $chat_item['hash'] = $channel['hash'];
            }
            if (!empty($channel['name'])) {
                $chat_item['channel_name'] = $channel['name'];
            }
            $formatted_messages = [];
            foreach($channel['messages'] as $message) {
                $formatted_messages[] = [
                    'user_id' => $message['user']['id'],
                    'name' => $message['user']['name'],
                    'message' => $message['message'],
                ];
            }
            $chat_item['messages'] = $formatted_messages;
            if (isset($channel['users'])) {
                $chat_item['user'] = !empty($channel['users'][0]) ? $channel['users'][0]['name'] : 'Anonymous';
            }

            $chat_list[] = $chat_item;
        }
        return $chat_list;
    }

    public function sendMessage(Request $request)
    {
        //TODO: Refactor
        $to_user_id = $request->get('to_id');
        $channel = $request->get('channel');
        $message = $request->get('message');
        $current_user = Auth::user();
        $channel_object = null;
        $new_channel = false;

        if (!$channel && !$to_user_id) {
            return response()->json([
                'result' => false,
                'message' => 'No recipient was set!',
            ]);
        }

        //If user id exist, check existing matches
        if ($to_user_id) {
            $to_user = User::find($to_user_id);
            if ($to_user) {
                $channel_object = Channel::checkMatch($current_user, $to_user)->first();
            } else {
                return response()->json([
                    'result' => false,
                    'message' => 'User not found!',
                ]);
            }
        }

        //If channel is inputted, select the channel with the hash
        if ($channel) {
            $channel_object = Channel::where('hash', $channel)->orWhere('name', $channel)->first();
        }

        //If no object was retrieved, then create a new channel
        if (!$channel_object) {
            $channel_object = Channel::create([
                'hash' => sha1(time()),
            ]);
            $new_channel = true;
        }

        //If a new channel as been created, notify both users and listen to new channels
        if ($new_channel) {
            //Notify both users
            $channel_object->users()->sync([$current_user->id, $to_user->id]);
            $current_user->notify(new NewChannel($channel_object, $to_user));
            $to_user->notify(new NewChannel($channel_object, $current_user));
        }

        //Add message to channel
        $message_object = Message::create([
            'message' => $message,
            'user_id' => $current_user->id,
            'channel_id' => $channel_object->id,
        ]);

        //Send message to user clients
        event(new MessageSent($channel_object, $message_object, $current_user));

        return response()->json([
            'result' => true,
            'message' => 'Successfully sent the message!',
        ]);
    }
}

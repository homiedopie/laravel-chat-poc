<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $channel;
    protected $user;
    protected $message;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($channel, $message, $user)
    {
        $this->channel = $channel;
        $this->message = $message;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        $suffix = !empty($this->channel->hash) ? $this->channel->hash: $this->channel->name;
        return new PrivateChannel('messages.'.$suffix);
    }

    /**
     * Broadcast type name
     * @return string
     */
    public function broadcastAs()
    {
        return 'message-sent';
    }

    /**
     * Broadcast payload
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'user_id' => $this->user->id,
            'name' => $this->user->name,
            'message' => $this->message->message
        ];
    }
}

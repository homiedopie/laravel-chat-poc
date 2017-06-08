<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NewChannel extends Notification
{
    use Queueable;
    protected $channel;
    protected $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($channel, $user)
    {
        $this->channel = $channel;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['broadcast'];
    }

    /**
     * Get the broadcastable representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return BroadcastMessage
     */
    public function toBroadcast($notifiable)
    {
        $hash = !empty($this->channel->hash) ? $this->channel->hash: $this->channel->name;
        return new BroadcastMessage([
            'channel' => $hash,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $hash = !empty($this->channel->hash) ? $this->channel->hash: $this->channel->name;
        return [
            'channel' => $hash,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name
        ];
    }
}

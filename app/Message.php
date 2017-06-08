<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * Only visible when serializing
     * @var array
     */
    protected $visible = ['message', 'user'];

    /**
     * Fillable during create
     * @var array
     */
    protected $fillable = ['message', 'user_id', 'channel_id'];

    /**
     * Message is owned by a single user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Message only belongs to a single channel
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}

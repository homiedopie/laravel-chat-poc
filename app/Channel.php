<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    /**
     * Fillable during create
     * @var array
     */
    protected $fillable = ['hash'];

    /**
     * Visible during serialization
     * @var array
     */
    protected $visible = ['messages', 'name', 'hash', 'users'];

    /**
     * A channel has many user messages
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * A channel has many users
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Check if current user and chat user has the same channel
     * @param $query
     * @param $current_user
     * @param $chat_user
     * @return mixed
     */
    public function scopeCheckMatch($query, $current_user, $chat_user)
    {
        return $query->whereHas('users',function($query) use ($current_user){
            $query->where('users.id', '=', $current_user->id);
        })->whereHas('users',function($query) use ($chat_user){
            $query->where('users.id', '=', $chat_user->id);
        })->take(1);
    }
}

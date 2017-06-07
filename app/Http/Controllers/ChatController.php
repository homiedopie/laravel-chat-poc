<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
        return view('chat.index');
    }
}

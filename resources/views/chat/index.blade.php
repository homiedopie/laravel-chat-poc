@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <div class="panel panel-default">
                    <div class="panel-heading">Global Chat</div>
                    <div class="panel-body">
                        <ul class="list-group chat-list">
                            <li class="list-group-item chat-item active" data-channel="global" data-messages=""><a href="#">Everyone</a></li>
                        </ul>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">Private Chat</div>
                    <div class="panel-body">
                       <ul class="list-group chat-list">
                           <li class="list-group-item chat-item" data-channel="private" data-messages=""><a href="#">John</a></li>
                           <li class="list-group-item chat-item" data-channel="private" data-messages=""><a href="#">Doe</a></li>
                       </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="panel panel-default">
                    <div class="panel-heading">Chat Dashboard</div>
                    <div class="panel-body">
                        <div class="chat-box">
                            <div class="chat-conversation-box panel panel-default">
                                <div class="panel-body">
                                    <div class="chat-conversation">
                                    </div>
                                </div>
                            </div>
                            <div class="chat-message-box">
                                <div class="row">
                                    <div class="col-sm-10">
                                        <div class="form-group">
                                            <label class="sr-only" for="chat-message-input">Message: </label>
                                            <input type="text" class="form-control" id="chat-message-input" placeholder="Enter your message here...">
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <button type="button" class="btn btn-primary form-control" id="chat-message-send">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

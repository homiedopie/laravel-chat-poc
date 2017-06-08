<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes();
Route::get('/', 'HomeController@index')->name('home');

Route::group(['prefix' => 'chat'], function () {
    Route::get('/', 'ChatController@index')->name('chat.index');
});

/** TODO: Place the ajax routes in other file */
Route::group(['prefix' => 'ajax', 'middleware' => 'ajax'], function(){
    Route::group(['prefix' => 'chat'], function () {
        Route::post('/send_message', 'ChatController@sendMessage')->name('chat.send-message');
    });
});
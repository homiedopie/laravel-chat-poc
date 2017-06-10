## Laravel Messaging (Chat) Proof Of Concept
- This is still work in progress and needs to be refactored

## Installation:
1. Do *git clone git@github.com:homiedopie/laravel-chat-poc.git*
2. Run *composer update --no-script*
3. Run *npm install* or *npm install --no-bin-links* for Windows Host OS
4. Setup the Environment Variables
 ..* Set *BROADCAST_DRIVER* to pusher
 ..* Add the pusher credentials
5. Update *config/broadcasting.php* with the other options like the cluster
6. Update the *resources/assets/js/bootstrap.js* file with the pusher details
7. Run the migration *php artisan migrate*
8. Run the seeder for global chat *php artisan db:seed --class=ChannelSeeder*
9. Access the app in the browser
10. Register and login and click the Chat Tab
11. Have fun!



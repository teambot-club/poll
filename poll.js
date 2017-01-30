"use strict";

var Poll = function(controller) {

    var poll = function(bot, message) {
            bot.api.reactions.add({
                timestamp: message.ts,
                channel: message.channel,
                name: 'robot_face',
            }, function(err, res) {
                if (err) {
                    console.log('Failed to add emoji reaction :(', err);
                }
            });

            var args = message.text.match(/".*?"/g),
                q = args[0],
            ;

            // handle missing args? 
            // if only question is present, ask for choices
            // if only one choice is present, ask for more?

            bot.reply(message, q + '/n test');

        },

        callMe = function(bot, message) {
            var name = message.match[1];
            controller.storage.users.get(message.user, function(err, user) {
                if (!user) {
                    user = {
                        id: message.user,
                    };
                }
                user.name = name;
                controller.storage.users.save(user, function(err, id) {
                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                });
            });
        },

        whoAmI = function(bot, message) {
            controller.storage.users.get(message.user, function(err, user) {
                if (user && user.name) {
                    bot.reply(message, 'Your name is ' + user.name);
                } else {
                    startAskForNameConversation(bot, message);
                }
            });
        };

    return {
        poll: poll
    };
};

module.exports = Poll;
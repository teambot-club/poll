"use strict";

var Poll = function(controller) {

    var consts = {
            indexBullets: [
                ":zero:",
                ":one:",
                ":two:",
                ":three:",
                ":four:",
                ":five:",
                ":six:",
                ":seven:",
                ":eight:",
                ":nine:"
            ],
            space: " ",
            newLine: "\n"
        },

        poll = function(bot, message) {
            bot.api.reactions.add({
                timestamp: message.ts,
                channel: message.channel,
                name: 'robot_face',
            }, function(err, res) {
                if (err) {
                    console.log('Failed to add emoji reaction :(', err);
                }
            });

            try {
                var args = getPollArgs(message);
                var q = args[0];

                // handle missing args? 
                // if only question is present, ask for choices
                // if only one choice is present, ask for more?

                var reply = q + consts.newLine;
                for (var i = 1; i < args.length; i++) {
                    reply += consts.indexBullets[i] + consts.space;
                    reply += args[i] + consts.newLine;
                }

                bot.reply(message, reply);
                //bot.reply(message, q + '\n test');
                //bot.reply(message, '\n line 2');
            } catch (ex) {
                bot.reply(message, "Oops, exception " + ex);
            }
        },

        // returns all quoted strings from message as array of args 
        getPollArgs = function(message) {
            var args = [],
                result = [],
                regex = /"((?:\\.|[^"\\])*)"/g;

            args = message.text.match(regex);

            for (var i = 0; i < args.length; i++) {
                var current = args[i].trim();

                if (current.charAt(0) === '"' && current.charAt(current.length - 1) === '"') {
                    current = current.substr(1, current.length - 2);
                }

                if (current) {
                    result.push(current);
                }
            }

            return result;
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
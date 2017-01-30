"use strict";

var Poll = function(controller, middleware) {

    var conversationSource = require('./poll.js')(controller);

    controller.hears(['poll'], 'direct_message,direct_mention,mention', middleware.process, conversationSource.poll);
};

module.exports = Poll;
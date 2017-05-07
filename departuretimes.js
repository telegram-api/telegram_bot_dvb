const token = ''; //FILL IN: MY BOT KEY
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(token);
//var bot = new TelegramBot(token, {polling: true}); //for local tests
bot.setWebHook('https://serene-reaches-78689.herokuapp.com/' + bot.token);

var dvb = require('dvbjs')
var timeOffset = 0;
var numResults = 10;

function str_line(line){
  if (line.length == 1){
    return line + "     ";
  }else{
    if (line.length == 2){
      return line + "   ";
    }
    return line;
  }
}

function str_time(time){
  if (Number(time) >= 60){
    return (Math.floor(Number(time)/60)).toString() + "h " + (Number(time)%60).toString();
  }else{
    return time;
  }
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text == '/start' || msg.text == '/info'){
    bot.sendMessage(chatId, 'Hallo, ich möchte dir aktuelle Abfahrtzeiten der DVB liefern.\nSchreibe mir einfach deine Haltestelle!');
    return ;
  }
  dvb.find(msg.text, function(err, data){
    var result = "";
    if (err) throw err;
    try{
       result += data[0]['stop'] + "\n";
       dvb.monitor(data[0]['id'], timeOffset, numResults, function(err, data) {
           if (err) throw err;
           for(var i = 0; i < numResults; i++){
             try{
               result += str_line(data[i]['line']) + " " + data[i]['direction'] + "  " + str_time(data[i]['arrivalTimeRelative']) + "'";
               result += "\n";
             }catch(err){}
           }
           bot.sendMessage(chatId, result);
       });
    }catch(err){}
  });
});

module.exports = bot;

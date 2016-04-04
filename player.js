var Player = require("player"),
    cheerio = require("cheerio"),
    keyress = require("keypress"),
    request = require("request");

var musicResource = "http://music.163.com/discover/toplist";    
var mp3Url = [];
//var player = new Player([mp3url]);

request(musicResource, function(error, response, body) {

	
	if (!error && response.statusCode == 200) {
		playFn(body);
	}else {
		console.log(error)
	}
	  
});

function playFn(body) {
	var $ = cheerio.load(body);

	var musicResourceJson = JSON.parse($("textarea").eq(0).text());
	var player = new Player(musicResourceJson.map(function(item) {return item.mp3Url;}));
	
	player.on("playing", function(item) {
        print_cli();
        print_current(musicResourceJson, item.src);
	});

    player.play();
	

	keyress(process.stdin);
	process.stdin.on("keypress", function(ch, key) {
		if (key && key.ctrl && key.name == "c") {
			process.stdin.pause();
		}
		if (key && key.name == "n") {
			player.next()
		}
		if (key && key.name == "p") {
            player.pause();
		}
	});

}
function print_cli() {
	process.stdout.cursorTo(0,0);
	process.stdout.clearScreenDown();
	console.log("-------------------------");
	console.log("       网易云音乐排行榜");
	console.log("       n: 下一首");
	console.log("       p: 暂停/继续");
	console.log("-------------------------");
}
function print_current(playList,playUrl){
    playList.forEach(function(item, index) {
    	if (item.mp3Url == playUrl) {
    		
    		console.log("当前播放：" + item.name + "          (" + item.artists[0].name + ")" + "     "+ (index+1) + "/" + playList.length);
    	}
    }) 
}

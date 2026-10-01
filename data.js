const CHARACTERS = [
["Fifi","F","Businesswoman","Sells popia/popia pisang","BUSINESS"],["Allia","F","Quiet","Soft and calm","SOFT"],
["Andika","M","Jokester","Outgoing, jokes and teases friends","JOKER"],["Najah","F","Leader","Bossy, natural leader","LEADER"],
["Wan","M","Nonchalant","Chill and unbothered","CHILL"],["Chiah","F","Trendsetter","Has a car, loves velocity TikTok","VELOCITY"],
["Qay","F","Sabahan","Outgoing, funny laugh","SABAH"],["Farisha","F","Photographer","Takes pictures everywhere","PHOTO"],
["Afdalia","F","Athlete","Tall, sporty, active","ATHLETE"],["Aiman","M","Spider-Man Nerd","Spider-Man fan, nerd (good kind)","SPIDEY"],
["Luqman","M","Speed Eater","Chinese-looking, athletic, eats fast","FAST"],
["Zaid","M","Jester","Jokester and class clown","JESTER"],["Daus","M","Literal","Slow, takes things literally, unathletic","LITERAL"],
["Izwan","M","Fast Food Nerd","Unathletic, loves fast food, nerd (bad kind)","FOODIE"],
["Wisha","F","Top Student","Smart, outspoken, top 2 of the batch","BRAIN"],
["Mila","F","Cool Camera","Needs her handheld fan, takes pictures","FAN"],
["Hanaan","F","Pink Collector","Photography, pink stuff, Air Chocolate","PINK"],
["Iman","F","Gamer Athlete","Gamer, sporty, likes CORTIS","GAMER"],
["Hanis (Kaklong)","F","Kaklong","Eldest, kind, good","KAKLONG"],
["Aumill","F","Ultra Nonchalant","Chillest, always wearing earphones","EARPHONES"],
["Zul","M","MLBB Addict","Plays MLBB 24/7, even in class","MLBB"],["Hazamin","M","Crashout Athlete","Athletic, crashout, fears popping balloons","CRASHOUT"],
["Caer","M","JPP","Smart, JPP, soft, too kind","JPP"],["Faris","M","Toy Guy","Normal ahh guy, likes toys","TOYS"],
["Umaira","F","Slay Scholar","Kelantanese, slay, smart, sporting","SLAY"],["Nur Hanan","F","Phone Person","Always on her phone","PHONE"],
["Dania","F","Motherly","Mother-like, old soul","MOTHER"]
];

const LOCATIONS = {
"class":{"name":"TESL D CLASS","desc":"Desks, whiteboard, TESL posters, bags and the familiar chaos of your class.","colour":"#5c3f58"},
"gym":{"name":"GYMNASIUM","desc":"Indoor court, hoops, benches, sports gear and echoing footsteps.","colour":"#40566a"},
"volley":{"name":"VOLLEYBALL COURT","desc":"A proper outdoor court with a net, poles, floodlights and campus greenery.","colour":"#4d765d"},
"canteen":{"name":"CANTEEN","desc":"Food stalls, tables, drinks, trays and the smell of lunch.","colour":"#8a6543"},
"averroes":{"name":"AVERROES HALL","desc":"A campus hall with stage, rows of seats and presentation lights.","colour":"#56455f"},
"vista":{"name":"VISTA ANGKASA","desc":"The boys' hostel hangout. Corridors, room doors, laundry and questionable decisions.","colour":"#46536e"}
};

const NPCS = [
{name:"Fifi",loc:"canteen",x:210,y:370,route:"fifi",role:"Businesswoman",lines:["Popia pisang? RM3.","Business is business.","If you help me sell five, I might owe you a favour."]},
{name:"Allia",loc:"class",x:175,y:290,route:"allia",role:"Quiet",lines:["Oh, hi.","I was just listening.","You can sit here if you want."]},
{name:"Andika",loc:"class",x:410,y:300,route:"andika",role:"Jokester",lines:["Bro, you look like you have a plan.","That's dangerous.","I can help. Probably."]},
{name:"Najah",loc:"class",x:650,y:295,route:"najah",role:"Leader",lines:["We need to organise this.","No, that is not how we're doing it.","Go. I have a task for you."]},
{name:"Wan",loc:"gym",x:240,y:360,route:"wan",role:"Nonchalant",lines:["Oh.","Yeah, sure.","It's not that serious."]},
{name:"Chiah",loc:"gym",x:650,y:330,route:"chiah",role:"Velocity",lines:["You saw the trend right?","Velocity.","Okay, we are NOT doing that in the corridor."]},
{name:"Qay",loc:"class",x:800,y:280,route:"qay",role:"Sabahan",lines:["Bah!","HAHAHAHAHA!","Why are you standing there like that?"]},
{name:"Farisha",loc:"volley",x:220,y:380,route:"farisha",role:"Photographer",lines:["Wait, don't move.","This lighting is actually nice.","I need one more picture."]},
{name:"Afdalia",loc:"volley",x:570,y:350,route:"afdalia",role:"Athlete",lines:["Volleyball later?","Come on, one game.","You are not escaping."]},
{name:"Aiman",loc:"class",x:330,y:300,route:"aiman",role:"Spider-Man Nerd",lines:["I have a theory.","It actually makes sense.","Trust me."]},
{name:"Luqman",loc:"canteen",x:460,y:390,route:"luqman",role:"Fast Eater",lines:["Wait, I'm eating.","Done.","What? That was fast?"]},
{name:"Zaid",loc:"gym",x:430,y:365,route:"zaid",role:"Jester",lines:["I have an idea.","It's a terrible idea.","Which is why it's perfect."]},
{name:"Daus",loc:"canteen",x:680,y:385,route:"daus",role:"Literal",lines:["You said literally?","Oh. Literally.","Okay, I did exactly that."]},
{name:"Izwan",loc:"canteen",x:770,y:390,route:"izwan",role:"Fast Food Nerd",lines:["Bro, fries.","I can explain the science.","Actually, no I can't."]},
{name:"Wisha",loc:"class",x:760,y:305,route:"wisha",role:"Top Student",lines:["Did you read the instructions?","There are three parts.","I already finished mine."]},
{name:"Mila",loc:"gym",x:760,y:350,route:"mila",role:"Photographer",lines:["My fan is dying.","Wait, picture first.","Okay, now I can breathe."]},
{name:"Hanaan",loc:"canteen",x:310,y:390,route:"hanaan",role:"Pink Collector",lines:["Is that pink?","Air Chocolate.","This is important."]},
{name:"Iman",loc:"volley",x:730,y:360,route:"iman",role:"Gamer Athlete",lines:["After this, one match.","Okay, maybe two.","CORTIS? Yeah, I listen."]},
{name:"Hanis (Kaklong)",loc:"class",x:530,y:295,route:"hanis",role:"Kaklong",lines:["Have you eaten?","Bring everyone together.","Come on, I'll help."]},
{name:"Aumill",loc:"class",x:900,y:290,route:"aumill",role:"Ultra Nonchalant",lines:["...","Hmm?","Oh."]},
{name:"Zul",loc:"class",x:80,y:300,route:"zul",role:"MLBB Addict",lines:["Wait, ranked.","One second.","Bro, I am jungling."]},
{name:"Hazamin",loc:"gym",x:560,y:365,route:"hazamin",role:"Crashout Athlete",lines:["DON'T POP THAT.","Why would you do that?!","Okay. I'm calm."]},
{name:"Caer",loc:"averroes",x:200,y:390,route:"caer",role:"JPP",lines:["It's okay, I can help.","Don't worry about it.","We should sort this properly."]},
{name:"Faris",loc:"averroes",x:460,y:400,route:"faris",role:"Toy Guy",lines:["Look at this.","It's actually cool.","I like toys, okay?"]},
{name:"Umaira",loc:"class",x:270,y:220,route:"umaira",role:"Slay Scholar",lines:["We can do this.","Easy.","Kelate energy. Let's go."]},
{name:"Nur Hanan",loc:"gym",x:120,y:360,route:"nurhanan",role:"Phone Person",lines:["Wait, I'm replying.","One sec.","Okay, what happened?"]},
{name:"Dania",loc:"canteen",x:570,y:395,route:"dania",role:"Motherly",lines:["Have you eaten?","Don't run.","Bring your friends too."]},
{name:"Dr Noor Hayati",loc:"averroes",x:700,y:360,route:"drnoor",role:"TESL D Mentor",lines:["So. How is the class?","You have been busy.","Remember why you're here."]}
];

const QUESTS = {
fifi:{title:"Popia Pipeline",desc:"Help Fifi sell 5 popia before lunch.",steps:["Talk to Fifi at the canteen.","Collect 3 customers by talking to students.","Return to Fifi."],reward:"Canteen Key"},
farisha:{title:"The Class Photo",desc:"Help Farisha capture five good TESL D moments.",steps:["Find Farisha at the volleyball court.","Collect 5 Photo Moments around campus.","Return to Farisha."],reward:"Photo Album"},
afdalia:{title:"Weekend Volleyball",desc:"Afdalia wants enough players for a game.",steps:["Talk to Afdalia.","Convince Iman and Hazamin to join.","Return to Afdalia."],reward:"Court Pass"},
zul:{title:"One More Match",desc:"Zul needs someone to cover for him while he finishes a ranked game.",steps:["Talk to Zul.","Bring him a snack from the canteen.","Return to Zul."],reward:"Phone Password"},
wisha:{title:"The Missing Notes",desc:"Wisha needs a set of notes that somehow disappeared.",steps:["Talk to Wisha.","Find the notes in TESL D Class.","Return to Wisha."],reward:"Brain Cell"},
hanaan:{title:"Pink Emergency",desc:"Hanaan needs her Air Chocolate and something pink.",steps:["Talk to Hanaan.","Find the pink item in the canteen.","Return to Hanaan."],reward:"Pink Token"},
caer:{title:"JPP Duty",desc:"Caer needs help preparing Averroes Hall.",steps:["Talk to Caer.","Find the presentation file.","Return to Caer."],reward:"Hall Access"},
drnoor:{title:"The Last Period",desc:"Complete the final mystery by helping enough classmates.",steps:["Complete 3 character quests.","Visit Dr Noor Hayati at Averroes Hall.","Face the final question."],reward:"END OF DAY"}
};

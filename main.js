var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var cache = ""
var toggle_feature = "on"

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	// ... INSERT HERE.
	client.lpush('urls',req.url);
	next(); // Passing the request to the next handler in the stack.
});

app.get('/recent', function(req, res)
{
	client.lrange('urls',0 , 4, function(err,value)
	{
		var temp=value;
		var print_url="";
		for (var i =0; i<temp.length;i++)
		{
			print_url=print_url+temp[i]+"<br>";
		}
		
		res.send(print_url);
	});	
})

 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		//console.log(img);
			client.lpush('cats', img, function(err)
 			{
 				res.status(204).end()
			});
 		});
 	}

    res.status(204).end()
 }]);

app.get('/meow', function(req, res) {
 	{
 		client.lrange('cats',0,0,function(err,items){
			res.writeHead(200, {'content-type':'text/html'});
			items.forEach(function (imagedata) 
			{
				res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
			});
			res.end();
		});
 	}
 })
 


app.get('/test', function(req, res) {
	{
		res.writeHead(200, {'content-type':'text/html'});
		res.write("<h3>test</h3>");
   		res.end();
	}
})

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }

    callback(null, lines[+line_no]);
}


app.get('/set', function(req , res)
{
	client.set('key', 'this message will self-destruct in 10 seconds');
	client.expire('key',10);
	res.send("value is set: it will self destruct in 10 seconds");

})

app.get('/get/key', function(req , res)
{
	client.get('key',function(err,value)
	{
		if (err) throw err
		if (value)
		{		
			var temp = value;		
			res.send(value);
		}
		else
		{
			res.send("timeout !!! or the set value for key is not done");
		}
	});
})

app.get('/set/togglecachefeature:*', function(req , res)
{
	var url_route=req.url.split(":");
	toggle_feature=url_route[1];
	res.send("toggle feature set to " + toggle_feature);
})

app.get('/get/catfact:*', function(req , res)
{
	var url_route=req.url.split(":");
	var fact_number=url_route[1];
	
	if (toggle_feature === "on")
	{			
		client.get(fact_number,function(err,value)
		{
			if (err) throw err
			if (value)
			{		
		        var start= (new Date).getMilliseconds();
				var temp = value;	
                var Duration = (new Date).getMilliseconds() - start;				
				res.send(value + "<br>Cache!!! Time taken to retrieve the line is " + Duration + "ms");
			}
			else
			{ 
		        var start = (new Date).getMilliseconds();
				get_line("catfacts.txt", parseInt(fact_number), function(err,line)
				{
					var Duration = (new Date).getMilliseconds() - start;
					res.send(line + "<br>Disk!!! Time taken to retrieve the line is " + Duration + "ms");
					client.set(fact_number,line);
					client.expire(fact_number,10);
				});
			}
		});				
	}	
	else if(toggle_feature === "off")
	{
		var start = (new Date).getMilliseconds();
		get_line("catfacts.txt", parseInt(fact_number), function(err,line)
		{
			var Duration = (new Date).getMilliseconds() - start;
					res.send(line + "<br>Disk!!! Time taken to retrieve the line is " + Duration + "ms");
		});
	}
})


app.get('/', function(req, res) 
{
	  res.send('hello world')
})





// HTTP SERVER
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

exports 

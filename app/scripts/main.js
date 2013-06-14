// Reference http://stackoverflow.com/questions/1176668/how-to-use-yql-to-retrieve-web-results
function YQLQuery(query, callback) {
    this.query = query;
    this.callback = callback || function(){};
    this.fetch = function() {

        if (!this.query || !this.callback) {
            throw new Error('YQLQuery.fetch(): Parameters may be undefined');
        }

        var scriptEl = document.createElement('script'),
            uid = 'yql' + +new Date(),
            encodedQuery = encodeURIComponent(this.query.toLowerCase()),
            instance = this;

        YQLQuery[uid] = function(json) {
            instance.callback(json);
            delete YQLQuery[uid];
            document.body.removeChild(scriptEl);
        };

        scriptEl.src = 'http://query.yahooapis.com/v1/public/yql?q='
                     + encodedQuery + '&format=json&callback=YQLQuery.' + uid; 
        document.body.appendChild(scriptEl);

    };
};


function DomCollector() {

	return {
		init: function() {
			this.contentObj = {};
		},
		getRemoteContents: function(remoteConfig) {
			var i = 0, length = remoteConfig.length;
			
			for (i; i < length; i++) {
				this.getElementContent(remoteConfig[i]);
			}
			
			return this.contentObj;
		},

		getElementContent: function( conf ) {
			// Construct your query:
			var query = "select * from html where (url='" + conf.url + "') and xpath='" + conf.xpath + "' ";



			// Construct your query:
			var query = "select * from html where (url='" + conf.url + "') and xpath='" + conf.xpath + "' ",
				uid = 'yql' + +new Date(),
				encodedQuery = encodeURIComponent(query.toLowerCase());

			var yql = 'http://query.yahooapis.com/v1/public/yql?q='
                     + encodedQuery+'&format=xml'; 

			$.ajax({
            	type: "GET",
            	url: yql,
            	dataType: "html",
            	success: function (data) {
            		// var data = json.query.results;
            		data = data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            		
	
					var html_pattern = /<html[^>]*>([\s\S]*?)<\/html>/gi;
					var match = html_pattern.exec(data);
					data = match[0];
					data = data.replace(/<!--[\s\S]*?-->/gi, '');

			
					var obj = $('body').append('<div id="remote" style="display:none;">'+data+'</div>');

					console.log(obj.find('title').text());

            		// console.log(xml);
            		// console.log($(xml)[2].innerHTML);
            		// console.log($(xml).find('results').find('head title').text());

            	}
            });




			// var that = this;
			// // Define your callback:
			// var callback = function(data) {
			// 	var last = conf.xpath.split('/').slice(-1)[0];
			// 	console.log(data.query.results);
			//     //var post = data.query.results.item;
			//     that.contentObj[conf.key] = data.query.results[last].content.trim();
			    
			// };

			// // Instantiate with the query:
			// var firstFeedItem = new YQLQuery(query, callback);

			// // If you're ready then go:
			// firstFeedItem.fetch(); // Go!!

		}
	}
};

$(document).ready(function(){
	
	var domCollector = new DomCollector();
	
	domCollector.init();
	// domCollector.getElement('http://elab.io', '//div[@id="container"]');
	// domCollector.getElement('http://oit.scps.nyu.edu/~sultans/javascript/', '/html/body/h2');

	domCollector.getRemoteContents([
		// {'key': 'title', 'url': 'http://oit.scps.nyu.edu/~sultans/javascript/', 'xpath': '/html/body/h2' },
		// {'key': 'time', 'url': 'http://oit.scps.nyu.edu/~sultans/javascript/', 'xpath': '/html/body/h2/font' },
		// {'key': 'elab', 'url': 'http://elab.io', 'xpath': '//div[@id=\"container\"]' },
		{'key': 'blog', 'url': 'http://elab.io', 'xpath': '//html', 'selector': 'head title' },
		// {'key': 'yahoo', 'url': 'http://yahoo.com', 'xpath': '//html', 'selector': 'head title' },
		// {'key': 'google', 'url': 'http://google.com', 'xpath': '//html', 'selector': 'head title' },
		// {'key': 'nyulaw', 'url': 'http://law.nyu.edu', 'xpath': '//html', 'selector': 'head title' },
		]);
	window.setTimeout(
		function(){
			console.log(domCollector.contentObj);
		}, 1000
	);
	
});
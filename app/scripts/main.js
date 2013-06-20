function DomCollector() {
	return {
		init: function() {
			this.contentObj = {};
			this.callbackCounter = 0; // use this to keep track of callback call
		},

		getRemoteContents: function(remoteConfig, callback) {
			var i = 0, length = remoteConfig.length;

			this.callbackCounter = remoteConfig.length;
			
			for (i; i < length; i++) {
				this.getElementContent(remoteConfig[i], callback);
			}

		},

		getElementContent: function( conf, callback ) {
			var domcollector = this;

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


					
					var obj = $('<div class="remote_data" style="display:none;">'+data+'</div>');
//					$('body').append(obj);


					var content = '';
					$.each(obj.find(conf.selector), function(index){
						 content +=  '<p>' + $(this).html() + '</p>';
					});
					
					domcollector.contentObj[conf.key] = content;
					
					// domcollector.contentObj[conf.key] = obj.find(conf.selector);
					

					domcollector.callbackCounter--;
					
					if (domcollector.callbackCounter === 0) {
						$('.remote_data').remove();
						callback();
					} 
            	}
            });
		}
	}
};

$(document).ready(function(){
	
	domCollector = new DomCollector();
	
	domCollector.init();
// /html/body/table[2]/tbody/tr[1]/td[2]/a[1]
// /html/body/table[2]/tbody/tr[1]/td[1]/b

	domCollector.getRemoteContents([
		{'key': 'title', 'url': 'http://oit.scps.nyu.edu/~sultans/javascript/', 'xpath': '//html', 'selector': 'title' },
		{'key': 'instructor', 'url': 'http://oit.scps.nyu.edu/~sultans/javascript/', 'xpath': '//html', 'selector': 'table:eq(1) tr:eq(1) strong' },
		{'key': 'email', 'url': 'http://oit.scps.nyu.edu/~sultans/javascript/', 'xpath': '//html', 'selector': 'table:eq(1) a:eq(0)' },
		{'key': 'course number', 'url': 'http://oit.scps.nyu.edu/~sultans/javascript/', 'xpath': '//html', 'selector': 'h2' },
		{'key': 'description', 'url': 'http://oit.scps.nyu.edu/~sultans/javascript/', 'xpath': '//html', 'selector': 'p:eq(2), p:eq(3), p:eq(4), ul:eq(0)' },
		// {'key': 'yahoo', 'url': 'http://yahoo.com/', 'xpath': '//html', 'selector': 'title' },
		// {'key': 'blog1', 'url': 'http://elab.io', 'xpath': '//html', 'selector': 'title' },
		// {'key': 'blog2', 'url': 'http://elab.io', 'xpath': '//html', 'selector': 'title' },
		// {'key': 'blog3', 'url': 'http://elab.io', 'xpath': '//html', 'selector': 'title' },

		], getRemoteContentsCallback);


	function getRemoteContentsCallback() {
			console.log(domCollector.contentObj);

			$.each(domCollector.contentObj, function(key, val){
				$('body').append('<h3>' + key + ':</h3>');
				$('body').append('<p>' + val + '</p>');
			});

	}
	
});
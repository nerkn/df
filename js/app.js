
var App = new Object();

App = {
splashScreenDuration: 1000,
altImage:{messages:'img/alt/messages.png',profile:'img/alt/profile.png',contact:'img/alt/contact.png',search:'img/alt/search.png'},
init: function() {
  if(/iPhone/i.test(navigator.userAgent))
	  $('body').addClass('iPhone');
  if(navigator.userAgent.toLowerCase().match(/ipad/))
	App.altImage = {messages:'img/alt/ipad/messages.png',profile:'img/alt/ipad/profile.png',contact:'img/alt/ipad/contact.png',search:'img/alt/ipad/search.png'}
  if(!login){
	App.loginFormForm();
  }else{
	App.onLogin();
  }
  $(".altImage").click(function(e){
	  var x = e.pageX - this.offsetLeft;
	  var y = e.pageY - this.offsetTop;
	  x = e.currentTarget.width / x;
	  if(x>4){	App.profile();
		}else if(x>1.9){	App.messages();
		}else if(x>1.3){	App.onLogin();
		}else{		App.contact();
	  }
  })
  App.updateDatabase();
  $('.backbutton').remove();
},
loginFormForm:function (){//creates login form
	$('.container.avMainPart').load('html/loginForm.html', '', function(){
	  $('.loginFormForm').submit(function(){App.loginForm(this);return false;})
	  $('.container.avFooter').parent().hide();
	  $('.projectTopBar .title').html('WELCOME');
	  $('body').addClass('bodyBG loginScreen');
	  $('.altImage, .rfd').hide();
	  $('.backbutton').remove();
	  App.fixIphoneKeyboard();
	})
},
loginForm:function(t){
  $.post('http://avparts.pubblicatasarim.com/login',
		$(t).serialize(),
		function(data){
			if(typeof(data)=='string'){
			  $('.avLoginError').html(data).show(). delay(5000).hide(500);
			}else{
			  user	   = data['user'];
			  localStorage.user = JSON.stringify(user);
			  messages = data['messages'];
			  localStorage.messages = JSON.stringify(messages);
			  App.onLogin();
			}
		},'json').fail(function(){
			$('.avLoginError').html('Connection Error').show().delay(5000).hide(500);
        });
		return false;
},
register:function(){
	$('.container.avMainPart').load('html/register.html','',function(){
		App.fixIphoneKeyboard();
		$('#phone').mask("+99 (999) 999 99 99");
	});
	$('.loginFormForm').submit(function(){App.registerSubmit(this);return false;})
	$('.container.avFooter').parent().hide();
	$('.projectTopBar .title').html('REGISTER');
	$('.projectTopBar').prepend("<a href='#' onClick='App.loginFormForm(this.parentNode);$(\"#TermsOfUseLink\").remove();' class='backbutton'><img src='img/back.png' /></a>"+
	"<a href='#' onClick='$(\"#TermsOfUse\").modal()' style='border: 1px solid #fff; border-radius: 10px; color: #244677;background-color:#fff;display: block;padding:1px 10px; position: absolute; right:10px; top: 10px;' id='TermsOfUseLink'>i</a>"
	);
	$('body').addClass('bodyBG loginScreen');
	$('.altImage, .rfd').hide();
},
registerSubmit:function(t){
  $.post('http://avparts.pubblicatasarim.com/register',
		 $(t).serialize(),
		 function(data){
			if(typeof(data)=='string'){
			  $('.avLoginError').html(data).show(). delay(5000).hide(500);
			}else{
			  user	   = data['user'];
			  localStorage.user = JSON.stringify(user);
			  messages = data['messages'];
			  localStorage.messages = JSON.stringify(messages);
			  $('#TermsOfUseLink').remove();
			  App.onLogin();
			}
		 },'json').fail(function(){
			$('.avLoginError').html('Connection Error').show().delay(5000).hide(500);
        })
},
forgetPassport:function (){
	  $('.backbutton').remove();
	  $('.projectTopBar').prepend("<a href='#' onClick='App.loginFormForm(this.parentNode)' class='backbutton'><img src='img/back.png' /></a>");
		  $('.container.avMainPart').load('html/forgetPassport.html','',function(){
			$('.container.avFooter').parent().hide();
			$('.projectTopBar .title').html('PASSWORD');
			$('body').addClass('bodyBG loginScreen');
			$('.altImage, .rfd').hide();
			App.fixIphoneKeyboard();
		  });
},
forgetPassportSubmit:function(t){
  $.post('http://avparts.pubblicatasarim.com/forgetPassword',
		$(t).serialize(),
		function(data){
			if(typeof(data)=='string'){
			  $('.avLoginError').html(data).show(). delay(5000).hide(500);
			}else{
			  $('.avLoginError').html('error').show(). delay(5000).hide(500);
			}
		},'json').fail(function(){
			$('.avLoginError').html('Connection Error').show().delay(5000).hide(500);
        });
		return false;
},
messages:function(){	$('.container.avMainPart').load('html/messages.html','',function(){
		App.syncWithServer();
		if(messages?1:0){
		  for(i in messages){
			  messages[i].ctimeM =messages[i].ctime.substr(5,2)+'.'+messages[i].ctime.substr(8,2)+'.'+ messages[i].ctime.substr(0,4);
			  messages[i].ctimeD =messages[i].ctime.substr(11,2)+':'+messages[i].ctime.substr(14,2);
		  }
		  themize(messages,'.templates .oneMessage', '.searchResults');
		  $('.oneMessage').click(function(){$(this).toggleClass('open')})
		}
		
		App.fixIphoneKeyboard();
	});
	$('.altImage').attr('src',App.altImage.messages);
	$('.projectTopBar .title').html('MESSAGES');
	$('.backbutton').remove();
	$('body').removeClass('bodyBG').scrollTop(0);
},
syncWithServer:function(){
  $.post('http://avparts.pubblicatasarim.com/syncWithServer',
		 'id='+user.id, function(data){
			  user = data['user'];
			  localStorage.user = JSON.stringify(user);
			  messages = data['messages'];
			  localStorage.messages = JSON.stringify(messages);
			  
		  for(i in messages){
			  messages[i].ctimeM =messages[i].ctime.substr(5,2)+'.'+messages[i].ctime.substr(8,2)+'.'+ messages[i].ctime.substr(0,4);
			  messages[i].ctimeD =messages[i].ctime.substr(11,2)+':'+messages[i].ctime.substr(14,2);
		  }
		  themize(messages,'.templates .oneMessage', '.searchResults');
		  $('.oneMessage').click(function(){$(this).toggleClass('open')})
  },'json').fail(function(){
			$('.avLoginError').html('Connection Error').show().delay(5000).hide(500);
  })
},
updateDatabase:function(){
  $.get('http://avparts.pubblicatasarim.com/database.csv?date='+(+new Date()), '', function(data){
	dbStock = CSVToArray(data, ';');
	for(d in dbStock)
		dbStock[d] = {part:dbStock[d][0].toLowerCase(), ist:parseInt(dbStock[d][1]), usa:parseInt(dbStock[d][2])}
	if(dbStock.length)
		dbStock.shift();
	localStorage.dbStock = JSON.stringify(dbStock);
  },'text')
},
profile:function(){
	$('.altImage').attr('src',App.altImage.profile);
	$('.projectTopBar .title').html('PROFILE');
	$('.backbutton').remove();
	$('.container.avMainPart').load('html/profile.html','', function(){
		for(i in user)
		  $('.pageProfile #'+i).val(user[i]);
		$('.logout').click(function() {
		  localStorage.clear();
		  dbCart = []
		  $('.userInfoUserName').html('');
		  App.loginFormForm();
		})
	  App.fixIphoneKeyboard();
	  $('#phone').mask("+99 (999) 999 99 99");
	});
	$('body').addClass('bodyBG').scrollTop(0);
},
profileSubmit:function(t){
  $.post('http://avparts.pubblicatasarim.com/updateUser',
		 $(t).serialize(),
		 function(data){
			if(typeof(data)=='string'){
			  $('.avLoginError').html(data).show(). delay(5000).hide(500);
			  
			}else{
			  user = data['user'];
			  localStorage.user = JSON.stringify(user);
			  messages = data['messages'];
			  localStorage.messages = JSON.stringify(messages);
			  $('.avLoginError').html(data['message']).show(). delay(5000).hide(500);
			}
		 },'json').fail(function(){
			$('.avLoginError').html('Connection Error').show().delay(5000).hide(500);
        })
},
onLogin:function(){
	$('.avLoginError').html('');
	$('.container.avMainPart').html();
	login=true;
	localStorage.login=true;
	  App.updateDatabase();
	  $('.backbutton').remove(); $('.container.avMainPart').load('html/productSearch.html','',function(){
		  
		  App.fixIphoneKeyboardBottom();
		  if(!recentSearches)
			return;
		  
		  for(i in recentSearches)
			$('.searchResults').prepend("<a class='recentSearches' href='' onClick='App.searchResultsAssign(this);return false;'>"+recentSearches[i]+"</a>");
			
		  $('.searchResults').prepend("<br /><b>RECENT SEARCHES</b>")
			
	  });
	  
	  App.updateCart();
	  $('body').removeClass('loginScreen');
	  $('body').removeClass('bodyBG').scrollTop(0);
	  $('.container .userInfoUserName').html(user.username);
	  $('.projectTopBar .title').html('SEARCH');
	  $('.altImage').attr('src',App.altImage.search);
	  App.updateDatabase();
	  setTimeout(function(){$('.container.avFooter').parent().show();
	  $('.altImage, .rfd').show();}, 200);
	  
},
searchResultsAssign:function(t){
	$('#search').val($(t).html());
	App.searchProducts();
},
searchProducts:function(){
		var d,di,searchVal, recentSearchesTmp;
		found= []
		if(searchVal = $('#search').val().toLowerCase()) {
			for(di in dbStock){
				d = dbStock[di];
				if(d.part.indexOf(searchVal)>-1){
					d.istCls = (d.ist<0)?'will':(d.ist?'':'stockOut');
					d.usaCls = (d.usa<0)?'will':(d.usa?'':'stockOut');
					found.push(d);
				}
			}
			recentSearchesVarmi = false
			recentSearchesTmp = [];
			for(di in recentSearches){
			  if(searchVal != recentSearches[di])
				recentSearchesTmp.push(recentSearches[di]);
			}
			recentSearchesTmp.push(searchVal)
			recentSearches = recentSearchesTmp;
			localStorage.recentSearches = JSON.stringify(recentSearches);
		}

		themize(found, '.templates .oneSearchResult', '.searchResults');
		$('.projectTopBar .title').html('SEARCH RESULTS');
		$('.projectTopBar').prepend("<a href='#' onClick='App.onLogin()' class='backbutton'><img src='img/back.png' /></a>");
		
		$('.altImage').attr('src',App.altImage.search);
		$(".oneSearchResult").each(function(){
		  var i;
		  
		  for(i in dbCart){
			if(dbCart[i]==$(this).find('.part').html())
				$(this).find('.addDrop').toggleClass('glyphicon-minus-sign').toggleClass('glyphicon-plus-sign');
		  }
		})
		if(false)
		$(".oneSearchResult").click(function(){
			var i;
			var part = $(this).find('.part').html();
			if($(this).find('.addDrop').hasClass('glyphicon-minus-sign')){
				for(i in dbCart)
					if(dbCart[i] == part)
						dbCart.splice(i, 1);
			}else{
				dbCart.push(part);
			}
			localStorage.dbCart = JSON.stringify(dbCart);
			$(this).find('.addDrop').toggleClass('glyphicon-minus-sign').toggleClass('glyphicon-plus-sign');
			App.updateCart();
		})
		$(".oneSearchResult .addDrop").click(function(){
			var i;
			var part = $(this).parent().find('.part').html();
			if($(this).hasClass('glyphicon-minus-sign')){
				for(i in dbCart)
					if(dbCart[i] == part)
						dbCart.splice(i, 1);
			}else{
				dbCart.push(part);
			}
			localStorage.dbCart = JSON.stringify(dbCart);
			$(this).toggleClass('glyphicon-minus-sign').toggleClass('glyphicon-plus-sign');
			App.updateCart();
		})
		fixedAyarla();
		return false;
},
updateCart:function(){
		if(dbCart.length){
			$('.rfd .counter').show();
			$('.rfd .counter').html(dbCart.length);
		}else{
			$('.rfd .counter').hide();
		}
},
contact:function(){
	$('.backbutton').remove();
	$('.projectTopBar .title').html('CONTACT');
	$('.container.avMainPart').load('html/contact.html', '', function(){
		for(i in user)
		  $('.pageContactForm #'+i).val(user[i]);
		$('.pophop').click(function(){
		//window.open("", "_system");
		navigator.app.loadUrl('https://www.google.com/maps/place/16711+Park+Centre+Blvd,+Miami,+FL+33169/@25.929726,-80.21724,17z/data=!3m1!4b1!4m2!3m1!1s0x88d9ae443918fc4f:0xbd7c109db85af0ad', { openExternal:true });
		
		return false;
		})
	
	  App.fixIphoneKeyboardBottom();
	})
	$('.altImage').attr('src',App.altImage.contact);
	$('body').addClass('bodyBG').scrollTop(0);
},
contactUsSendMessage:function(t){
  if($('.pageContactTextarea').val().length<10){
	 App.alert('Please enter more than 10 characters.', 'Message Detail');
	 return false;
  }
  $.post('http://avparts.pubblicatasarim.com/message',
  $(t).serialize(),
  function(data){
	if(typeof(data)=='string'){
		$('.avLoginError').html(data).show(). delay(5000).hide(500);
		$('.pageContactTextarea').val('');
		/*
		dbCart = [];
		localStorage.dbCart = JSON.stringify(dbCart);
		App.updateCart();
		*/
	}
  },'json').fail(function(){
	  $('.avLoginError').html('Connection Error').show().delay(5000).hide(500);
  });
  return false;
		
},
rfqForm:function(){
	$('.backbutton').remove();
	$('.container.avMainPart').load('html/rfqForm.html','', function(){
	  for(i in dbCart)
		$('.rfqForm .selectedParts').append(themizeReturn([{part:dbCart[i]}], '.templates .oneRFQPart'));
	  for(i in user)
		$('.rfqForm #'+i).val(user[i]);
	  App.fixIphoneKeyboard();
	  $('.oneRFQPart .selectEveryThing').focus(function(){this.setSelectionRange(0,0)})
	  $('#disclaims').modal()
	});
	$('.projectTopBar .title').html('RFQ');
	$('.altImage').attr('src',App.altImage.contact);
	$('body').removeClass('bodyBG');
},
rfqFormSubmit:function(t){
	rfqFormSubmitvarmi = [];
  $('.rfqForm .oneRFQPart').each(function(){
	if($(this).find('.oneRFQPartPart').prop('checked')){
	  if(!$(this).find('.selectEveryThing').val())
		rfqFormSubmitvarmi.push($(this).find('.oneRFQPartPart').val())
	}
  });
  if(rfqFormSubmitvarmi.length){
	App.alert('Please enter quantity information for : '+ rfqFormSubmitvarmi.join(', '), 'Empty Quantity');
	return false;
  }
	
  $.post('http://avparts.pubblicatasarim.com/rfqFormSubmit',
		$(t).serialize(),
		function(data){
			if(typeof(data)=='string'){
			  $('.avLoginError').html(data).show(). delay(5000).hide(500);
			  
			dbCart = [];
			localStorage.dbCart = JSON.stringify(dbCart);
			App.updateCart();
			}
		},'json').fail(function(){
			$('.avLoginError').html('Connection Error').show().delay(5000).hide(500);
        });
		return false;
},
fixIphoneKeyboard:function(){
  $('input, textarea').unbind('focus').focus(function(){$('.projectTopBar').hide();})
  $('input, textarea').unbind('blur').blur(function(){
	setTimeout(function(){
	  window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
	  $('.projectTopBar').show();
	}, 450)
  })
},
fixIphoneKeyboardBottom:function(){
  $('input, textarea').unbind('focus').focus(function(){$('.projectTopBar, .altImage').hide(); })
  $('input, textarea').unbind('blur').blur(function(){
	setTimeout(function(){
	  window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
	  $('.projectTopBar, .altImage').show();
	}, 450)
  })
},
alert:function(body, header){
  $('#Alert .modal-body').html(body);
  $('#Alert .modal-title').html(header);
  $('#Alert').modal();
}

}
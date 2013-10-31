$(document).ready(function(){
	$("#login-user-message").hide();
	
	$.getJSON("/cron/is_loged_in/", function(data){
		if(data){
			Khronos.active_panel = LoginForm;
			LoginForm.success(data.user);
		}
	});
	
	$("#login-btn").on("click", function(e){
		LoginForm.validate();
	});
	
	$("#register-link").on("click", function(e){
		e.preventDefault();
		slide_to("left", $("#login-form"), function(){
			$("#register-form").load("/cron/register/");
		});
	});
	
	Khronos.active_panel = LoginForm;

});

LoginForm = {
	
	user_field : $("#login-user"),
	pass_field : $("#login-password"),
	
	clean : function(){
		this.user_field.val("");
		this.pass_field.val("");
	},
	
	slide_to : function(side, after){
		slide_to(side, $("#login-form"), after);
	},
	
	validate : function(){
		$("#login-user-message").hide()
		$("#login-pass-message").hide()
		if(this.user_field.val() === ""){
			$("#login-user-message")
			.html("Ingrese usuario")
			.attr("class","alert")
			.fadeIn(500);
			this.user_field.focus();
			return
		}
		if(this.pass_field.val() === ""){
			$("#login-pass-message")
			.html("Ingrese contraseña")
			.attr("class","alert")
			.fadeIn(500);
			this.pass_field.focus();
			return
		}
		var that = this;
		$.getJSON("/cron/login/",
		{ user : this.user_field.val(),
		  pass : this.pass_field.val() }
		, function(data){
			if(data){
				that.success(data.user)
			}else{
				$("#login-user-message")
				.html("Usuario o contraseña incorrectos.")
				.attr("class","alert alert-error")
				.fadeIn(500);
			}
		});
	},
	
	success : function(username){
		Khronos.username = username;
		Khronos.loged_in = true;
		$("#login-form")
		.animate({'left':'-=350px', 'position':'absolute'},'slow', function(){
			$("#login-form").hide();
			$("#main-panel-acordion").load("/cron/main_panel/");
		});
	}
}


$(document).ready(function(){
	slide_from("right", $("#register-form"), function(){
		RegisterForm.init();
	});
	
	$("#back-to-login").on("click", function(e){
		e.preventDefault();
		slide_to("right", $("#register-form"), function(){
			slide_from("left", $("#login-form"));
		});
	});
});

RegisterForm = {
	
	user_field : $("#register-user"),
	email_field : $("#register-email"),
	pass_field : $("#register-password"),
	conf_pass_field : $("#register-confirm-password"),
	
	conf_button : $("#register-btn"),
	
	init : function(){
		this.user_field.focus();
		this.conf_button.on("click", this.conf_button_clicked);
		
		Khronos.active_panel = RegisterForm;
		
	},
	
	slide_to : function(side, after){
		slide_to(side, $("#register-form"), after);
	},
	
	validate : function(){
		$("#register-user-message").hide();
		$("#register-email-message").hide();
		$("#register-pass-message").hide();
		
		if(this.user_field.val() === ""){
			$("#register-user-message")
			.text("Ingrese nombre de usuario")
			.attr("class","alert")
			.fadeIn(500);
			this.user_field.focus();
			return;
		}
		
		if(this.email_field.val() === ""){
			$("#register-email-message")
			.text("Ingrese email")
			.attr("class","alert")
			.fadeIn(500);
			this.email_field.focus();
			return;
		}
		
		if(!(isEmail(this.email_field.val()))){
			$("#register-email-message")
			.text("No parece un email")
			.attr("class","alert")
			.fadeIn(500);
			this.email_field.focus();
			return;
		}
		
		if(this.pass_field.val() === ""){
			$("#register-pass-message")
			.text("Ingrese password")
			.attr("class","alert")
			.fadeIn(500);
			this.pass_field.focus();
			return;
		}
		
		if(this.conf_pass_field.val() === ""){
			$("#register-pass-message")
			.text("Confirme el password")
			.attr("class","alert")
			.fadeIn(500);
			this.conf_pass_field.focus();
			return;
		}
		
		if(this.conf_pass_field.val() !== this.pass_field.val()){
			$("#register-pass-message")
			.text("Los passwords no coinciden")
			.attr("class","alert")
			.fadeIn(500);
			this.conf_pass_field.val("");
			this.pass_field.val("") 
			this.pass_field.focus() 
			return;
		}
		
		$.getJSON("/cron/register/",
		{
			username : this.user_field.val(),
			password1 : this.pass_field.val(),
			password2 : this.pass_field.val(),
			email : this.email_field.val()
		},
		function(data){
			if(data.invalid_user){
				$("#register-user-message")
				.text("Ya existe un usuario con ese nombre.")
				.attr("class","alert")
				.fadeIn(500);
				RegisterForm.user_field.focus();
			}
			
			if(data.invalid_email){
				$("#register-email-message")
				.text("Ya existe un usuario con ese email.")
				.attr("class","alert")
				.fadeIn(500);
				RegisterForm.email_field.focus();
			}
			if(data.user){
				Khronos.username = data.user;
				slide_to("left", $("#register-form"), function(){
					$("#main-panel-acordion").load("/cron/main_panel/")
					$("#register-form").hide();
				});
			}
			
			
		});
	},
		
	conf_button_clicked : function(e){
		RegisterForm.validate();
	},
}

$(document).ready(function(){
	slide_from("right", $("#main-panel-accordion"), function(){
		MainPanel.init();
	});
});

MainPanel = {
	
	nav_bar : {
		help_btn : $("#help-btn"),
	},
	
	slide_to : function(side, after){
		slide_to(side, $("#main-panel-accordion"), after);
	},
	
	set_tooltips : function(){
		$("#inicio-btn").tooltip({title:"ir al panel principal"});
		$("#help-btn").tooltip({
			title:"Ayuda online",
			placement:"right"
		});
		$("#proyectos").tooltip({
			title:"ver crear buscar"
		});
		$("#tooltips-checkbox").attr("checked",true)
	},
	
	del_tooltips : function(){
		$("#inicio-btn").tooltip('destroy');
		$("#help-btn").tooltip('destroy');
		$("#proyectos").tooltip('destroy');
		$("#tooltips-checkbox").attr("checked",false)
	},
	
	on_cron_stop : function(){
		/*
		LoginForm.clean();
		Khronos.loged_in = false;
		Khronos.active_activitie = null;
		Khronos.active_project = null;
		$("#active-project").text("");
		$("#active-activitie").text("");
		$("#active-project-activitie").hide();
		Khronos.username = "";
		slide_from("left", $("#login-form"));
		$("#cronometer-control").hide();
		$("#app-navbar").hide();*/
		window.location = "/cron/login/";
	},
	
	init : function(){
		that = this;
		
		$("#save-settings-btn").on("click", function(e){
			if($("#tooltips-checkbox").is(':checked') == true){
				var tooltips = "true";
				Khronos.tooltips = true;
			}else{
				var tooltips = "false";
				Khronos.tooltips = false;
			}
			
			$.getJSON("/cron/save_settings/",
			{
				tooltips : tooltips
			},
			function(data){
				if($("#tooltips-checkbox").is(':checked') == false){
					MainPanel.del_tooltips();
				}else{
					that.set_tooltips();
				}
				alert("Cambios guardados")
			})
		});
		
		$.getJSON("/cron/get_user_settings/", function(data){
			if(data.tooltips == "true"){
				Khronos.tooltips = true;
				that.set_tooltips();
			}
		});
		
		$("#cronometer-control").show();
		$("#app-navbar").show();
		this.nav_bar.help_btn.on("click", this.hep_btn_clicked);
		Khronos.active_panel = MainPanel;
		
		$("#username-label").text(Khronos.username);
		
		$("#logout-btn").on("click", function(e){
			e.preventDefault();
			$.get("/cron/salir/", function(date){
				slide_to("right", $("#main-panel-accordion"), function(){
					if(Khronos.cron.interval_id){
						Khronos.cron.stop(MainPanel.on_cron_stop());
					}else{
						MainPanel.on_cron_stop();
					}
				});
			});
		});
		
		
		$("#proyectos").on("click", function(){
			slide_to("left", $("#main-panel-accordion"), function(){
				$("#project-panel").load("/cron/project_panel/");
			});
		});
	},
	
	hep_btn_clicked : function(e){
		e.preventDefault();
		window.open("/documentacion/");
	},
	
}

$(document).ready(function(){
	slide_from("right", $("#activitie-panel"), function(){
		ActivitiePanel.init();
		Khronos.active_panel = ActivitiePanel;
	});
});


ActivitiePanel = {
	
	nav_bar : {
		help_btn : $("#help-btn"),
	},
	
	activitie_field : $("#activitie-input"),
	add_button : $("#add-activitie-button"),
	search_btn : $("#search-activitie-button"),
	input_message : $("#activitie-input-message"),
	
	update_navbar : function(){
		if(!Khronos.active_project){
			Khronos.active_project = this.project.id;
			$("#active-project").text(this.project.name.substr(0,10)+"..");
		}
	},
	
	init : function(){
		this.project = {
			id : $("#project-activities-id").val(),
			name : $("#project-activities-name").val()
		};
		
		$("#nav-projects-btn").on("click", this.update_navbar);
		$("#inicio-btn").on("click", this.update_navbar);
		
		this.update_navbar();
		
		
		this.add_button.on("click", this.add_button_clicked);
		this.nav_bar.help_btn.on("click", this.hep_btn_clicked);
		this.search_btn.on("click", this.search_btn_clicked);
		
		Khronos.active_panel = ActivitiePanel;

		this.activitie_field.on("keyup", function(e){
			window.setTimeout(function(){
				if(ActivitiePanel.activitie_field.val() === ""){
					$("#search-activitie-list").fadeOut(500,function(){
						$("#activities-list").fadeIn(500);
						$("#search-activitie-list").html("");
					});
					ActivitiePanel.input_message.fadeOut(500);
				}
			}, 20);
		});
		
		
		$.getJSON("/cron/get_project_activities/"+this.project.id+"/",
		function(data){
			for(var i in data){
				ActivitiePanel.render_activitie_row(data[i]);
			}
		});
		
		
	},
	
	slide_to : function(side, after){
		slide_to(side, $("#activitie-panel"), after);
	},
	
	add_button_clicked : function(e){
		$("#activitie-input-message").hide();
		if(ActivitiePanel.activitie_field.val()===""){
			$("#activitie-input-message")
			.text("Ingrese un nombre de tarea")
			.fadeIn(400)
			.attr("class","alert");
			ActivitiePanel.activitie_field.focus();
			return;
		}
		
		$.getJSON("/cron/add_activitie/",
		{
			nombre:ActivitiePanel.activitie_field.val(),
			project_id:ActivitiePanel.project.id,
		},
		function(data){
			if(data.duplicated_activitie){
				ActivitiePanel.input_message
				.html("Nombre duplicado")
				.attr("class", "alert alert-error")
				.fadeIn(500);
				ActivitiePanel.activitie_field.focus();
				return;
			}else{
				ActivitiePanel.activitie_field.val("").focus();
				ActivitiePanel.render_activitie_row({ id:data.id, nombre:data.nombre });
			}
			
		});
	},
	
	render_activitie_row : function(row_data, render_in){
		$("#activitie-row-tmpl") 
		.tmpl(row_data)
		.hide()
		.prependTo("#"+(render_in||"activities-list"))
		.fadeIn(500)
		.data("activitie-id",row_data.id)
		.data("activitie-name", row_data.nombre)
		.on("click",function(e){
			var id = $(this).data('activitie-id');
			var name = $(this).data("activitie-name");
			slide_to("left",
			$("#activitie-panel"),
			function(){
				$("#activitie-details-panel").load("/cron/activitie_details_panel/"+id+"/",
				function(){
					$("#nav-activitie-btn")
					.text($("#project-activities-name").val().substr(0,10)+"..").show();
					
					if(!Khronos.interval){
						Khronos.active_activitie = id;
						$("#active-activitie").text(name.substr(0,10)+"..")
						.show();
						$("#active-project-activitie").show();
					}					
				});
			});
		});
	},
	
	
	search_btn_clicked : function(e){
		$("#activitie-input-message").hide();
		if(ActivitiePanel.activitie_field.val()===""){
			$("#activitie-input-message")
			.text("Ingrese un nombre de tarea")
			.fadeIn(400)
			.attr("class","alert");
			ActivitiePanel.activitie_field.focus();
			return;
		}
		
		var key = ActivitiePanel.activitie_field.val();
		
		$.getJSON("/cron/search_project_activities/",
		{
			key: key,
			project_id:ActivitiePanel.project.id
		},
		function(data){
			$("#search-activitie-list").html("");
			if(data){
				$("#activitie-input-message")
				.text("Resultados de '"+key+"' ("+data.length+"):")
				.fadeIn(400)
				.attr("class","alert alert-success");
				ActivitiePanel.activitie_field.focus();
				for(var i in data){
					ActivitiePanel.render_activitie_row(data[i], "search-activitie-list");
				}
				
				$("#activities-list").fadeOut(500,function(){
					$("#search-activitie-list").fadeIn(500);
				});
			}
			
		});
	},
	
}

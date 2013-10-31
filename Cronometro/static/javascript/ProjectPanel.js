$(document).ready(function(){
	slide_from("right", $("#project-panel"), function(){
		ProjectPanel.init();
	});
});

ProjectPanel = {
	
	nav_bar : {
		help_btn : $("#help-btn"),
	},
	
	project_field : $("#project-input"),
	add_button : $("#add-project-button"),
	search_btn : $("#search-project-button"),
	input_message : $("#project-input-message"),
	
	init : function(){
		
		this.add_button.on("click", this.add_button_clicked);
		this.nav_bar.help_btn.on("click", this.hep_btn_clicked);
		this.search_btn.on("click", this.search_btn_clicked);
		
		
		Khronos.active_panel = ProjectPanel;


		this.project_field.on("keyup", function(e){
			window.setTimeout(function(){
				if(ProjectPanel.project_field.val() === ""){
					$("#search-projects-list").fadeOut(500,function(){
						$("#projects-list").fadeIn(500);
						$("#search-projects-list").html("");
					});
					ProjectPanel.input_message.fadeOut(500);
				}
			}, 20);
		});
		
		
		$.getJSON("/cron/get_user_projects/",
		function(data){
			for(var i in data){
				ProjectPanel.render_project_row(data[i]);
			}
		});
		
	},
	
	slide_to : function(side, after){
		slide_to(side, $("#project-panel"), after);
	},
	
	add_button_clicked : function(e){
		$("#project-input-message").hide();
		if(ProjectPanel.project_field.val()===""){
			$("#project-input-message")
			.text("Ingrese un nombre de proyecto")
			.fadeIn(400)
			.attr("class","alert");
			ProjectPanel.project_field.focus();
			return;
		}
		
		$.getJSON("/cron/add_project/",
		{
			nombre:ProjectPanel.project_field.val()
		},
		function(data){
			if(data.duplicated_proyect){
				ProjectPanel.input_message
				.html("Nombre duplicado")
				.attr("class", "alert alert-error")
				.fadeIn(500);
				ProjectPanel.project_field.focus();
				return;
			}else{
				ProjectPanel.project_field.val("").focus();
				ProjectPanel.render_project_row({ id:data.id, nombre:data.nombre });
			}
			
		});
	},
	
	render_project_row : function(row_data, render_in){
		$("#project-row-tmpl") 
		.tmpl(row_data)
		.hide()
		.prependTo("#"+(render_in||"projects-list"))
		.fadeIn(500)
		.data("project_id",row_data.id)
		.data("project-name",row_data.nombre)
		.on("click",function(e){
			var id = $(this).data('project_id');
			var name = $(this).data('project-name');
			slide_to("left",
			$("#project-panel"),
			function(){
				$("#activitie-panel").load("/cron/activitie_panel/"+id+"/",
				function(){
					$("#nav-projects-btn").text("Proyectos").show();
					if(!Khronos.active_project || !Khronos.active_activitie){
						Khronos.active_project = id;
						$("#active-project").text(name.substr(0,10)+"..");
						$("#active-project-activitie").show();
					}
				});
			});
		});
	},
	
	
	search_btn_clicked : function(e){
		$("#project-input-message").hide();
		if(ProjectPanel.project_field.val()===""){
			$("#project-input-message")
			.text("Ingrese un nombre de proproject_idyecto")
			.fadeIn(400)
			.attr("class","alert");
			ProjectPanel.project_field.focus();
			return;
		}
		
		var key = ProjectPanel.project_field.val();
		
		$.getJSON("/cron/search_user_projects/",
		{
			key: key
		},
		function(data){
			$("#search-projects-list").html("");
			if(data){
				$("#project-input-message")
				.text("Resultados de '"+key+"' ("+data.length+"):")
				.fadeIn(400)
				.attr("class","alert alert-success");
				ProjectPanel.project_field.focus();
				for(var i in data){
					ProjectPanel.render_project_row(data[i], "search-projects-list");
				}
				$("#projects-list").fadeOut(500,function(){
					$("#search-projects-list").fadeIn(500);
				});
			}
			
		});
	},
	
}

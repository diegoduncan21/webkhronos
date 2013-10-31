$(document).ready(function(){
	Khronos.init();
});


Khronos = {
	
	slice_time : 250,
	
	active_panel : null,
	
	loged_in : false,
	
	init : function(){
		
		$("#inicio-btn").on("click", function(e){
			e.preventDefault()
			if(Khronos.loged_in){
				if(Khronos.active_panel !== MainPanel){
					Khronos.active_panel.slide_to("right", function(){
						slide_from("left", $("#main-panel-accordion"));//kijniji
						Khronos.active_panel = MainPanel;
						$("#nav-projects-btn").hide();
						$("#nav-activitie-btn").hide();
					});
				}
			}
		});
		
		$("#nav-projects-btn").on("click",function(e){
			e.preventDefault();
			Khronos.active_panel.slide_to("right",function(){
				$("#nav-projects-btn").hide();
				$("#nav-activitie-btn").hide();
				slide_from("left",$("#project-panel"));
				Khronos.active_panel = ProjectPanel;
			});
		});
		
		$("#nav-activitie-btn").on("click",function(e){
			e.preventDefault();
			Khronos.active_panel.slide_to("right",function(){
				$("#nav-activitie-btn").hide();
				slide_from("left",$("#activitie-panel"));
				Khronos.active_panel = ActivitiePanel;
			});
		});
		
		window.onbeforeunload = function(){
			if(Khronos.cron.interval_id){
				return 'Hay una tarea midiendose.';
			}
		};
	},
	
	active_activitie : null,
}



function slide_from(dir, jqelem, after){
	if(dir === "left"){
		jqelem.css(dir,"-350px");
		dir = '+=350px';
	}
	if(dir === "right"){
		jqelem.css('left',"350px");
		dir = '-=350px';
	}
	jqelem.show();
	jqelem.animate({'left':dir,  'position':'absolute'},
		Khronos.slice_time, after);
}


function slide_to(dir, jqelem, after){
	
	jqelem.css('left',"0px");
	if(dir === "left"){
		dir = '-=350px';
	}
	if(dir === "right"){
		dir = '+=350px';
	}
	
	jqelem.animate({'left':dir,  'position':'absolute'},
		Khronos.slice_time,function(){
		jqelem.hide();
		after();
	});
}



function isEmail(email) {
  var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

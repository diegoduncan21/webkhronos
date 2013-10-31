$(document).ready(function(){
	slide_from("right", $("#activitie-details-panel"), function(){
		ActivitieDetailsPanel.init();
	});
});

ActivitieDetailsPanel = {
	
	play_btn : $("#activitie-play-btn"),
	activitie_id : $("#activitie-id").val(),
	play_btn_label : $("#activitie-play-btn-label"),
	
	
	format_secconds : function (secconds) {
		var sec_num = secconds; // don't forget the second parm
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = hours+':'+minutes+':'+seconds;
		return time;
	},

	show_pie_chart : function(){
		that.options = {'title':'Intervalos: '+that.total_tareas+' - Total minutos: '+that.format_secconds(that.total_minutos),
					   'width':'100%',
					   'height':200};
		that.chart = new google.visualization.PieChart(document.getElementById('intervals-chart'));
		that.chart.draw(that.chart_data, that.options);

	},
	
	init : function(){
		that = ActivitieDetailsPanel;
		
		Khronos.active_panel = ActivitieDetailsPanel;
		this.activitie_name = $("#activitie-name").val();
		
		this.activitie = {
			id : $("#activitie-id").val(),
			name : $("#activitie-name").val()
		};
		
		
		this.project = {
			id : $("#activitie-project-id").val(),
			name : $("#activitie-project-name").val()
		}

		$("#show-bar-chart-btn").on("click",function(){


		});

		$("#show-bar-chart-btn").on("click",function(){


		});
		
		$("#confirm-change-btn").on("click", function(e){
			/* Tengo que hacer que pare el cronometro, ponga esta tarea como activa,
			 * ponga el projecto de esta tarea como activo y que
			 * empiece el cronometro con esta tarea.
			 * */
			e.preventDefault();
			Khronos.cron.stop(function(){
				Khronos.active_activitie = that.activitie.id;
				Khronos.active_project = that.project.id;

				$("#active-activitie").text(that.activitie.name.substr(0,10)+"..");
				$("#active-project").text(that.project.name.substr(0,10)+"..");

				Khronos.cron.play();
				$("#modal-confirm-change").modal('hide');
				$("#change-activitie-btn").hide();
			});
			
			
		})
		
		
		this.change_activitie = function(e){
			$("#modal-confirm-change").modal({ backdrop: false });
		};

		
		if(Khronos.interval){
			// hay una actividad. Puedo cambiar si no es la misma.
			if(Khronos.active_activitie != this.activitie.id){
				$("#change-activitie-btn").show()
				.on("click",this.change_activitie);
			}
		}
		
		$.getJSON("/cron/get_activitie_intervals/",
		{
			activitie_id : ActivitieDetailsPanel.activitie_id,
		},
		function(data){
			if(data.length > 0){
				
				that.chart = null;
				that.chart_data = null;
				that.options = null;
				
				that.rows = [];
				that.total_tareas = 0;
				that.total_minutos = 0;
				for(var i in data){
					that.total_tareas+=1;
					that.total_minutos+=data[i].duracion;
					$("#interval-row-tmpl")
					.tmpl(data[i])
					.prependTo("#intervals-table")
					.data("interval-id",data[i].id);
					that.rows.push([data[i].inicio, data[i].duracion]);
				}


				that.chart_data = new google.visualization.DataTable();
				that.chart_data.addColumn('string', 'Tarea');
				that.chart_data.addColumn('number', 'Porcentaje');

				that.chart_data.addRows(that.rows);

				// Set chart options
				
				that.show_pie_chart();
			}
		});

	},
	
	slide_to : function(side, after){
		slide_to(side, $("#activitie-details-panel"), after);
	}
}

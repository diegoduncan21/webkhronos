$(document).ready(function(){

var Cronometro = function(qinput, qplay_bt, qpause_bt, qstop_bt){
	
	var that = this;

	this.qinput = qinput;
	this.qplay_bt = qplay_bt;
	this.qpause_bt = qpause_bt;
	this.qstop_bt = qstop_bt;
	
	this.qpause_bt.attr("disabled","disabled");
	this.qstop_bt.attr("disabled","disabled");
	
	this.paused = false;
	this.tick = null;

	this.qplay_bt.on("click", function(e){
		that.play();
	});

	this.qpause_bt.on("click", function(e){
		that.paused = true;
		that.qpause_bt.attr("disabled","disabled");
		that.qplay_bt.removeAttr("disabled");
	});

	this.qstop_bt.on("click", function(e){
		that.stop();
	});

	this.reset = function(){
		this.days = 0;
		this.hours = 0;
		this.minutes = 0;
		this.secconds = 0;
		this.total_secconds = 0;
	};
	
	this.stop = function(after){

		window.clearInterval(that.tick);
		that.tick = null;
		that.paused = false;
		
		var interval_id = that.interval_id;
		that.interval_id  = null;

		that.qplay_bt.removeAttr("disabled");
		$("#input-proyecto").removeAttr("disabled");
		$("#add-proyecto").removeAttr("disabled");
		that.qpause_bt.attr("disabled","disabled");
		that.qstop_bt.attr("disabled","disabled");

		var cron_data = {
			days : that.days,
			hours : that.hours,
			minutes : that.minutes,
			secconds : that.secconds
		}
		
		$.getJSON("/cron/cron_stop/",
		{
			interval_duration : that.total_secconds,
			interval_id : interval_id
		},
		function(data){
			that.interval_id = null;
			Khronos.interval = null;
			Khronos.cron.interval_id = null;
			that.qinput.val("0 00:00:00");
			if(Khronos.active_panel == ActivitieDetailsPanel){
				ActivitieDetailsPanel
				// Qué estaba pasando acá?
				// Me imagino que acá quería poner que actualice la gráfica y la tabla.
			}
			if(after){
				after();
			}
		});
		
	};

	this.play = function(e){
		if(Khronos.active_activitie){
			that.qpause_bt.removeAttr("disabled");
			that.qstop_bt.removeAttr("disabled");
			that.qplay_bt.attr("disabled","disabled");
			if(!that.tick){
				that.reset();
				that.set_cron_text();
				$.getJSON("/cron/cron_play/",
				{
					activitie_id : Khronos.active_activitie
				},
				function(data){
					Khronos.interval = data.id;
					that.start_running(data.id);
				});
			}else{
				that.paused = false;
			}
		}else{
			alert("No hay una tarea seleccionada");
		}
	}
	
	this.start_running = function(interval_id){
		that.interval_id = interval_id;
		that.tick = window.setInterval(that.__run, 1000);
	}

	this.set_cron_text = function(){
		if(that.secconds < 10){
			var secconds = "0"+that.secconds.toString();
		}else{
			var secconds = that.secconds.toString();
		}

		if(that.minutes < 10){
			var minutes = "0"+that.minutes.toString();
		}else{
			var minutes = that.minutes.toString();
		}

		if(that.hours < 10){
			var hours = "0"+that.hours.toString();
		}else{
			var hours = that.hours.toString();
		}

		var days = that.days.toString();

		var cron_text = days+" "+hours+":"+minutes+":"+secconds;
		that.qinput.val(cron_text);
	}

	this.__run = function(){
		if(!that.paused){
			that.secconds += 1;
			that.total_secconds += 1;
			if(that.secconds > 59){
				that.minutes += 1;
				that.secconds = 0;
				if(that.minutes > 59){
					that.hours += 1;
					that.minutes = 0;
					if(that.hours > 23){
						that.days += 1;
						that.hours = 0;
					}
				}
			}

			that.set_cron_text();
		}
	}
};

Khronos.cron = new Cronometro($("#cron-input"), $("#btn-play"),
						$("#btn-pause"), $("#btn-stop"));

});

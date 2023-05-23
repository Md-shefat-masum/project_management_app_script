let dashboard = Vue.component("dashboard", {
	created: function () {
		console.log("dashboard init");
	},
	methods: {},
	template: `
          <section class="my-5">
              <div class="container">
                  <h2 class="mb-5">At A Glance</h2>
                  <div class="row gy-3">
                        <div class="col-md-4">
                          <div class="card progress_cards shadow-sm border-0">
                              <div class="card-body">
                                  <h3 class="heading"> Start Date </h3>
                                  <div class=" bottom d-flex justify-content-between">
                                      <div class="progresss d-flex">
                                          <div class="qty">
                                            <?= get_project_start_date() ?> 
                                          </div>
                                      </div>
                                      <div class="icon">
                                          <i class="fa-solid fa-arrow-trend-up"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                        </div>

                        <div class="col-md-4">
                            <div class="card progress_cards shadow-sm border-0">
                                <div class="card-body">
                                    <h3 class="heading"> Project working days </h3>
                                    <div class=" bottom d-flex justify-content-between">
                                        <div class="progresss d-flex">
                                            <div class="qty">
                                              <?= date_diff() ?> 
                                            </div>
                                        </div>
                                        <div class="icon">
                                            <i class="fa-solid fa-arrow-trend-up"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                      <div class="col-md-4">
                          <div class="card progress_cards shadow-sm border-0">
                              <div class="card-body">
                                  <h3 class="heading"> Progress </h3>
                                  <div class=" bottom d-flex justify-content-between">
                                      <div class="progresss d-flex">
                                          <div class="qty">
                                            <?= get_completed_progress() ?> 
                                          </div>%
                                      </div>
                                      <div class="icon">
                                          <i class="fa-solid fa-arrow-trend-up"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="col-md-4">
                          <div class="card  progress_cards shadow-sm border-0">
                              <div class="card-body">
                                  <h3 class="heading">Total task</h3>
                                  <div class=" bottom d-flex justify-content-between">
                                      <div class="progresss d-flex">
                                          <div class="qty"> 
                                            <?= count_total_task() ?> 
                                          </div>
                                      </div>
                                      <div class="icon">
                                          <i class="fa-solid fa-list-check"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="col-md-4">
                          <div class="card  progress_cards shadow-sm border-0">
                              <div class="card-body">
                                  <h3 class="heading">Completed task</h3>
                                  <div class=" bottom d-flex justify-content-between">
                                      <div class="progresss d-flex">
                                          <div class="qty"> 
                                            <?= count_completed_task() ?> 
                                          </div>
                                      </div>
                                      <div class="icon">
                                          <i class="fa-solid fa-list-check"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="col-md-4">
                          <div class="card  progress_cards shadow-sm border-0">
                              <div class="card-body">
                                  <h3 class="heading">Remaining task</h3>
                                  <div class=" bottom d-flex justify-content-between">
                                      <div class="progresss d-flex">
                                          <div class="qty"> 
                                            <?= count_total_task() - count_completed_task() ?> 
                                          </div>
                                      </div>
                                      <div class="icon">
                                          <i class="fa-solid fa-list-check"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>

              </div>
          </section>
      `,
});
let tasks = Vue.component("task", {
	data: function () {
		return {
			interval: null,
			start_time: null,
			working_hour: null,
			min: 0,
		};
	},
	created: function () {
		this.start_time = moment().tz("Asia/Dhaka");
	},
	methods: {
		start_task: function (event, row_no) {
			let that = this;
			if (event.target.classList.contains("fa-pause")) {
				event.target.classList.remove("fa-pause");
				event.target.classList.add("fa-play");
				document.querySelector(".work_times.active").classList.remove("active");
				that.save_end_time(row_no, that.min);
				clearInterval(that.interval);
			} else {
				event.target.classList.remove("fa-play");
				event.target.classList.add("fa-pause");

				if (document.querySelectorAll(".task_list_ul i.fa-pause").length > 1) {
					alert("close running task before starting new task");
					event.target.classList.remove("fa-pause");
					event.target.classList.add("fa-play");
					document.querySelector(".task_list_ul i.fa-pause").scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
					return 0;
				}

				that.save_start_time(row_no);
				start_time = that.start_time;
				that.interval = setInterval(function () {
					that.render_work_time();
					that.render_this_task_work_time(row_no);
					if (that.min >= 60) {
						that.save_end_time(row_no, that.min);
						that.min = 0;
					}
					that.min++;
				}, 1000);
			}

			console.log(event, row_no);
		},
		save_end_time: function (row_no, sec) {
			google.script.run.set_track_work_time({
				date: new Date().toDateString(),
				start_time: "",
				end_time: moment().format("HH:mm:ss"),
				total_sec: sec * 1000,
				row_no: row_no,
			});
		},
		save_start_time: function (row_no) {
			google.script.run.set_track_work_time({
				date: new Date().toDateString(),
				start_time: moment().format("HH:mm:ss"),
				end_time: "",
				total_sec: 0,
				row_no: row_no,
			});
			Toast.fire({
				icon: "success",
				title: "Timer Started",
			});
		},
		render_work_time: function () {
			let that = this;
			that.working_hour = document.getElementById("working_hour");

			var mili_sec = +that.working_hour.dataset.work_sec;
			var times = that.ms_to_hours(mili_sec);
			that.working_hour.innerHTML = `${times.hours}:${times.minutes}:${times.seconds}`;
			that.working_hour.dataset.work_sec = mili_sec + 1000;
		},
		render_this_task_work_time: function (row_no) {
			let that = this;
			let this_task_working_hour = document.getElementById("ms_" + row_no);

			!this_task_working_hour.classList.contains("active") && this_task_working_hour.classList.add("active");
			var mili_sec = +this_task_working_hour.dataset.ms;
			this_task_working_hour.innerHTML = new Date(mili_sec).toISOString().slice(11, 19) + ` hrs`;
			this_task_working_hour.dataset.ms = mili_sec + 1000;
		},
		ms_to_hours: function (value) {
			var now = moment();
			var seconds = moment.duration(value).seconds();
			var minutes = moment.duration(value).minutes();
			var hours = Math.trunc(moment.duration(value).asHours());
			return {
				hours: hours.toString().padStart(2, "0"),
				minutes: minutes.toString().padStart(2, "0"),
				seconds: seconds.toString().padStart(2, "0"),
			};
		},
		complete_task: function (event, row_no) {
			google.script.run.complete_task(row_no, event.target.checked == true ? 1 : 0);
			if (event.target.checked == true) {
				Toast.fire({
					icon: "success",
					title: "task added to completed",
				});
			} else {
				Toast.fire({
					icon: "warning",
					title: "task removed from completed",
				});
			}
		},
		save_work_start_time: function (event, row_no) {
			google.script.run.save_work_start_time(row_no, event.target.value || "");
			Toast.fire({
				icon: "success",
				title: "work start time been saved",
			});
		},
		save_work_end_time: function (event, row_no) {
			google.script.run.save_work_end_time(row_no, event.target.value || "");
			Toast.fire({
				icon: "success",
				title: "work end time been saved",
			});
		},
		save_item_delay: function (event, row_no) {
			google.script.run.save_item_delay(row_no, event.target.value || "");
			Toast.fire({
				icon: "success",
				title: "item delay been saved",
			});
		},
		save_item_delay_comment: function (event, row_no) {
			google.script.run.save_item_delay_comment(row_no, event.target.value || "");
			Toast.fire({
				icon: "success",
				title: "item delay comment been saved",
			});
		},
	},

	template: `
          <div>
            <div class="cells headings">
                <div class="cols titles">
                    Titles
                </div>
                <div class="cols start_date">
                    Start Date
                </div>
                <div class="cols end_date">
                    End Date
                </div>
                <div class="cols work_start_time">
                    Work Start Time
                </div>
                <div class="cols work_end_time">
                    Work End Time
                </div>
                <div class="cols work_times">
                    Work Time
                </div>
                <div class="cols delay">
                    Delay
                </div>
                <div class="cols delay_comment">
                    Delay Comment
                </div>
                <div class="cols completion_days">
                    Completion Days
                </div>
                <div class="cols assign_to">
                    Assign to
                </div>
                <div class="cols is_done">
                    Is Done
                </div>
                <div class="cols priority">
                    priority
                </div>
            </div>
            <ul class="task_list_ul">
                <? var data = getTasks();?>
                <? for (var i = 0; i < data.length; i++) { ?>
                    <li> 
                      <div class="task_heading">
                        <?= data[i].title ?> 
                      </div>
                    </li>
                    <? if(data[i].children.length){ ?>
                        <li>
                            <ul>
                                <? for (var j = 0; j < data[i].children.length; j++) { ?>
                                <li> 
                                  <div class="task_heading">
                                    <?= data[i].children[j].title ?> 
                                  </div>
                                </li>
                                    <? if(data[i].children[j].children.length){ ?>
                                        <li>
                                            <ul>
                                                <? for (var k = 0; k < data[i].children[j].children.length; k++) { ?>
                                                    <? item = data[i].children[j].children[k]; ?>
                                                    <li> 
                                                        <div class="task_content">
                                                            <? if(item.is_done == 1){ ?>
                                                              <input @change="complete_task($event, <?= item.row_no ?>)" checked type="checkbox" class="form-check-input d-inline-block">
                                                            <?}else{ ?>
                                                              <input @change="complete_task($event, <?= item.row_no ?>)" type="checkbox" class="form-check-input d-inline-block">
                                                            <? } ?>

                                                            <i class="fa fa-play" @click="start_task($event, <?= item.row_no ?>)"></i>

                                                            <span style="flex:1;">
                                                                <?= item.title ?>
                                                            </span>
                                                        </div>
                                                        <div class="cells">
                                                            <div class="cols start_date">
                                                                <?= item.start_date_formated ?>
                                                            </div>
                                                            <div class="cols end_date">
                                                                <?= item.end_date_formated ?>
                                                            </div>
                                                            <div class="cols work_start_time">
                                                                <? if(item.work_start_time_formated != '') { ?>
                                                                  <?= item.work_start_time_formated ?>
                                                                <? } else{ ?>
                                                                  <input type="datetime-local" @change="save_work_start_time($event,<?= item.row_no ?>)">
                                                                <? } ?>
                                                            </div>
                                                            <div class="cols work_end_time">
                                                                <? if(item.work_end_time_formated != '') { ?>
                                                                  <?= item.work_end_time_formated ?>
                                                                <? } else{ ?>
                                                                  <input type="datetime-local" @change="save_work_end_time($event,<?= item.row_no ?>)">
                                                                <? } ?>
                                                            </div>
                                                            <div class="cols work_times" data-ms="<?= item.work_times_ms ?>" id="<?= 'ms_'+item.row_no ?>">
                                                                <?= item.work_times ?> hrs
                                                            </div>
                                                            <div class="cols delay">
                                                              <? if(item.delay != '') { ?>
                                                                <?= item.delay ?> hrs
                                                              <? } else{ ?>
                                                                <input type="number" @change="save_item_delay($event,<?= item.row_no ?>)"> hrs
                                                              <? } ?>
                                                            </div>
                                                            <div class="cols delay_comment">
                                                              <? if(item.delay_comment != '') { ?>
                                                                <?= item.delay_comment ?> hrs
                                                              <? } else{ ?>
                                                                <textarea type="number" @change="save_item_delay_comment($event,<?= item.row_no ?>)"></textarea>
                                                              <? } ?>
                                                            </div>
                                                            <div class="cols completion_days">
                                                                <?= item.completion_days ?> days
                                                            </div>
                                                            <div class="cols assign_to">
                                                                <?= item.assign_to ?>
                                                            </div>
                                                            <div class="cols is_done">
                                                                <?= item.is_done == 1 ? 'yes' : 'no' ?>
                                                            </div>
                                                            <div class="cols priority">
                                                                <select name="" value="<?= item.priority ?>" id="">
                                                                    <option value="low">low</option>
                                                                    <option value="medium">medium</option>
                                                                    <option value="heigh">heigh</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </li>
                                                <? } ?>
                                            </ul>
                                        </li>
                                    <? } ?>
                                <? } ?>
                            </ul>
                        </li>  
                    <? } ?>
                <? } ?>
            </ul>
        </div>
      `,
});

let task_json = Vue.component("task_json", {
	data: function () {
		return {
			data: [],
		};
	},
	created: function () {},
	template: `
      <pre>
        <? var data = getTasks();?>
        <?= JSON.stringify(data, undefined, 3) ?>
      </pre>
    `,
});

const routes = [
	{ path: "/", component: dashboard },
	{ path: "/tasks", component: tasks },
	{ path: "/task_json", component: task_json },
];

const router = new VueRouter({
	routes, // short for `routes: routes`
	linkExactActiveClass: "active",
});

new Vue({
	router,
	el: "#app",
	data: function () {
		return {};
	},
	created: function () {
		this.$nextTick(function () {
			this.render_work_time();
		});
	},
	updated: function () {
		this.$nextTick(function () {});
	},
	methods: {
		render_work_time: function () {
			let that = this;
			that.working_hour = document.getElementById("working_hour");

			var mili_sec = +that.working_hour.dataset.work_sec;
			var times = that.ms_to_hours(mili_sec);
			that.working_hour.innerHTML = `${times.hours}:${times.minutes}:${times.seconds}`;
			that.working_hour.dataset.work_sec = mili_sec + 1000;
		},
		ms_to_hours: function (value) {
			var now = moment();
			var seconds = moment.duration(value).seconds();
			var minutes = moment.duration(value).minutes();
			var hours = Math.trunc(moment.duration(value).asHours());
			return {
				hours: hours.toString().padStart(2, "0"),
				minutes: minutes.toString().padStart(2, "0"),
				seconds: seconds.toString().padStart(2, "0"),
			};
		},
	},
});

setInterval(() => {
	document.getElementById("today_date").innerHTML = new moment().format("ddd DD MMM, YYYY | hh:mm:ss a");
}, 1000);

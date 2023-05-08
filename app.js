let dashboard = Vue.component("dashboard", {
	created: function () {
		console.log("dashboard init");
	},
	methods: {},
	template: `
        <section class="my-5">
            <div class="container">
                <h2 class="mb-5">Today Progress</h2>
                <div class="row gy-3">
                    <div class="col-md-4">

                        <div class="card progress_cards shadow-sm border-0">
                            <div class="card-body">
                                <h3 class="heading">Activity</h3>
                                <div class=" bottom d-flex justify-content-between">
                                    <div class="progresss d-flex">
                                        <div class="qty">00</div>%
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
                                <h3 class="heading">Completed task</h3>
                                <div class=" bottom d-flex justify-content-between">
                                    <div class="progresss d-flex">
                                        <div class="qty">00</div>
                                    </div>
                                    <div class="icon">
                                        <i class="fa-solid fa-list-check"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 class="mb-5 mt-5">Last week Progress</h2>
                <div class="row gy-3">
                    <div class="col-md-4">
                        <div class="card  progress_cards shadow-sm border-0">
                            <div class="card-body">
                                <h3 class="heading">Weekly Activity</h3>
                                <div class=" bottom d-flex justify-content-between">
                                    <div class="progresss d-flex">
                                        <div class="qty">20</div>%
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
                                <h3 class="heading">Worked this week</h3>
                                <div class=" bottom d-flex justify-content-between">
                                    <div class="progresss d-flex">
                                        <div class="qty">20:23:00</div> min
                                    </div>
                                    <div class="icon">
                                        <i class="far fa-clock"></i>
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
                                        <div class="qty">20</div>
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
	created: function () {
		console.log("task init");
	},
	template: `
        <div class="task_table">
            <div class="table-responsive task_table_list">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Is Done</th>
                            <th>Start</th>
                            <th>Phase</th>
                            <th>Task</th>
                            <th>Sub Tasks</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Work Start Date</th>
                            <th>Work End Date</th>
                            <th>Work Times</th>
                            <th>Delay</th>
                            <th>Delay Comment</th>
                            <th>Completion Days</th>
                            <th>Assign To</th>
                            <th>Progress %</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in 40">
                            <td>1</td>
                            <td class="text-center">
                                <div class="form-check d-inline-block form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                </div>
                            </td>
                            <td class="text-center">
                                <div class="form-check d-inline-block form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                </div>
                            </td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                            <td>aaa</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
});

const routes = [
	{ path: "/", component: dashboard },
	{ path: "/tasks", component: tasks },
];

const router = new VueRouter({
	routes, // short for `routes: routes`
	linkExactActiveClass: "active",
});

new Vue({
	router,
	el: "#app",
	data: function () {
		return {
			start_time: null,
			tracker_interval: null,
			working_hour: null,
			tracker_control: null,
		};
	},
	created: function () {
        this.$nextTick(function () {
        });
	},
	updated: function () {
        this.$nextTick(function () {
        });
	},
	methods: {
		start_time_tracker: function () {
			this.working_hour = document.getElementById("working_hour");
			this.tracker_control = document.querySelector(".tracker_control");
			if (this.tracker_control.classList.contains("fa-play")) {
				this.tracker_control.classList.remove("fa-play");
				this.tracker_control.classList.add("fa-pause");
				start_time = moment();

				tracker_interval = setInterval(() => {
					var diff = moment.duration(moment().diff(start_time));
					this.working_hour.innerHTML = "";
					this.working_hour.innerHTML += diff.hours().toString().padStart(2, "0") + ":";
					this.working_hour.innerHTML += diff.minutes().toString().padStart(2, "0") + ":";
					this.working_hour.innerHTML += diff.seconds().toString().padStart(2, "0");
				}, 1000);

				// google.script.run.set_track_work_time({
				// 	date: new Date().toDateString(),
				// 	start_time: moment().format("HH:MM:SS"),
				// 	end_time: "",
				// });
			} else {
				this.tracker_control.classList.remove("fa-pause");
				this.tracker_control.classList.add("fa-play");
				clearInterval(tracker_interval);
				// google.script.run.set_track_work_time({
				// 	date: new Date().toDateString(),
				// 	start_time: "",
				// 	end_time: moment().format("HH:MM:SS"),
				// });
			}
		},
	},
});

setInterval(() => {
	document.getElementById("today_date").innerHTML = new moment().format("ddd DD MMM, YYYY | hh:mm:ss a");
}, 1000);

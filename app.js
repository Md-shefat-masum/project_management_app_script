let dashboard = Vue.component("dashboard", {
    created: function () {
        console.log("dashboard init");
    },
    template: '<div>dashboard</div>'
})
let tasks = Vue.component("task", {
    created: function () {
        console.log("task init");
    },
    template: '<div>task</div>'
})

const routes = [
	{ path: "/", component: dashboard },
	{ path: "/tasks", component: tasks },
];

const router = new VueRouter({
	routes, // short for `routes: routes`
});

new Vue({
	router,
	el: "#app",
	data: function () {
		return {
			tasks: [],
			selected_el: {},
		};
	},
	created: function () {
		console.log("hello");
	},
});

setInterval(() => {
	document.getElementById("today_date").innerHTML = new moment().format("ddd DD MMM, YYYY | hh:mm:ss a");
}, 1000);

let start_time = null;
let tracker_interval = null;
let working_hour = document.getElementById("working_hour");
let tracker_control = document.querySelector(".tracker_control");
function start_time_tracker() {
	if (tracker_control.classList.contains("fa-play")) {
		tracker_control.classList.remove("fa-play");
		tracker_control.classList.add("fa-pause");
		start_time = moment();

		tracker_interval = setInterval(() => {
			var diff = moment.duration(moment().diff(start_time));
			working_hour.innerHTML = "";
			working_hour.innerHTML += diff.hours().toString().padStart(2, "0") + ":";
			working_hour.innerHTML += diff.minutes().toString().padStart(2, "0") + ":";
			working_hour.innerHTML += diff.seconds().toString().padStart(2, "0");
		}, 1000);

		// google.script.run.set_track_work_time({
		// 	date: new Date().toDateString(),
		// 	start_time: moment().format("HH:MM:SS"),
		// 	end_time: "",
		// });
	} else {
		tracker_control.classList.remove("fa-pause");
		tracker_control.classList.add("fa-play");
		clearInterval(tracker_interval);
		// google.script.run.set_track_work_time({
		// 	date: new Date().toDateString(),
		// 	start_time: "",
		// 	end_time: moment().format("HH:MM:SS"),
		// });
	}
}

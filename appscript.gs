function set_track_work_time(data) {
  const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1R7SVU4pjgUq6-mdo3oKEh644e5P05bdY20BSsorJtRk/edit')
  const sheet = ss.getSheetByName('test');
  var last_row = sheet.getLastRow() + 1;
  sheet.getRange(last_row, 1).setValue(data?.date);
  sheet.getRange(last_row, 2).setValue(data?.start_time);
  sheet.getRange(last_row, 3).setValue(data?.end_time);
  sheet.getRange(last_row, 4).setValue(data?.row_no);
  sheet.getRange(last_row, 5).setValue(data?.total_sec);

  sheet.getRange(last_row, 6).setValue(Session.getActiveUser().getEmail());
  // Logger.log(data)
}

function sum_of_track_secs() {
  const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1R7SVU4pjgUq6-mdo3oKEh644e5P05bdY20BSsorJtRk/edit')
  const sheet = ss.getSheetByName('test');
  var last_row = sheet.getLastRow();
  const data = sheet.getRange(`E2:E`+last_row).getValues();
  return data.reduce((t,i)=>t+=(+i),0);
}

function getTasks() {
  const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1R7SVU4pjgUq6-mdo3oKEh644e5P05bdY20BSsorJtRk/edit')
  const sheet = ss.getSheetByName('maintain gant_chart');
  var last_row = sheet.getLastRow() + 1;

  const data = sheet.getRange("A12:O127").getValues();
  // let list = data.filter((i) => i[0] != '').map((i) => i.filter((i) => i != ''));
  let parent = data[0][0];
  let parent_no = 0;
  let one_step_child_no = 0;
  let tree_list = [
    {
      title: parent,
      children: [],
    }
  ];
  for (i = 0; i < data.length; i++) {
    let new_parent = data[i][0];
    if (new_parent != '' && new_parent != parent) {
      parent = new_parent;
      tree_list.push({
        title: new_parent,
        children: [],
      })
      parent_no++;
      one_step_child_no = 0;
    }

    if (new_parent == '' && data[i][1] != '') {
      tree_list[parent_no].children.push({
        title: data[i][1],
        children: [],
      })
      one_step_child_no++;
    }

    if (new_parent == '' && data[i][1] == '' && data[i][2] != '') {
      tree_list[parent_no].children[one_step_child_no - 1].children.push({
        row_no: 12+i,
        title: data[i][2],

        start_date: data[i][3],
        start_date_formated: format_date(data[i][3]),

        end_date: data[i][4],
        end_date_formated: format_date(data[i][4]),

        work_start_time: data[i][5],
        work_start_time_formated: format_date_time(data[i][5]),

        work_end_time: data[i][6],
        work_end_time_formated: format_date_time(data[i][6]),

        work_times: data[i][7],

        delay: data[i][8],
        delay_comment: data[i][9],

        completion_days: date_diff_days(data[i][5], data[i][6]),

        assign_to: data[i][11],
        is_done: data[i][12],
        progresses: data[i][13],
        priority: data[i][14],
        children: [],
      })
    }

  }
  Logger.log(tree_list[0]);
  return tree_list;
}

function format_date(date, format = "dd MMM, yyyy") {
  return Utilities.formatDate(new Date(date), "Asia/Dhaka", format)
}

function format_date_time(date, format = "dd MMM, yyyy hh:mm a") {
  return Utilities.formatDate(new Date(date), "Asia/Dhaka", format)
}

function date_diff_days(from = "2023-06-09T01:00:00+0000", to = "2023-06-10T05:20:26+0000") {
  var dt1 = new Date(to), // today's date
    dt2 = new Date(from); // your date from API

  // get milliseconds
  var t1 = dt1.getTime(),
    t2 = dt2.getTime();

  var diffInDays = Math.floor((t1 - t2) / (24 * 3600 * 1000));
  // 24*3600*1000 is milliseconds in a day
  console.log(diffInDays);
  return diffInDays == 0 ? 1 : diffInDays;
}












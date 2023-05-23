function doGet(e) {
  return HtmlService.createTemplateFromFile('demo').evaluate();
}

function calcSRS() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // var sheet = ss.getSheets()[3];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('srs and costing');
  var lastRow = sheet.getLastRow();
  var sheetName = sheet.getSheetName();

  // var range = sheet.getDataRange();
  // var values = range.getValues();
  // Logger.log(values);

  var phases = {};
  var phase_index = '';
  var phase_task_index = '';
  var project_start_date = new Date(sheet.getRange("C1:E1").getValue());
  var per_day_work_hour = sheet.getRange('B1').getValue();

  for (var i = 4; i <= lastRow; i++) {
    var data = sheet.getRange('A' + i + ':J' + i).getValues();
    var phase = data[0][1];
    var task = data[0][2];
    var sub_task = data[0][3];
    var sub_task_hours = data[0][7];

    if (phase) {
      phase_index = phase;
      phases[phase_index] = {};
      phases[phase_index]['tasks'] = [];
      phases[phase_index]['task_hours'] = 0;
      phases[phase_index]['task_date'] = '';
    }

    if (task) {
      phase_task_index = task;
      phases[phase_index]['tasks'].push({
        title: task,
        hours: 0,
      });
    }

    if (sub_task || (!sub_task && task)) {
      var tasks_len = phases[phase_index]['tasks'].length - 1;
      phases[phase_index]['tasks'][tasks_len]['hours'] += parseFloat(sub_task_hours || 0);
    }
  }

  Logger.log(phases);

  var testSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('project_cost_and_milestones');
  testSheet.getRange("A12:D" + lastRow).clear();
  var headings = [
    ["Milestone", "Tasks", "Hrs", "Date"]
  ];

  testSheet.getRange("A12:D12").setValues(headings).setBackground('#0c343d').setFontColor('white');

  var per_total_hours = 0;
  var total_day = 0;
  for (var j = 0; j < Object.keys(phases).length; j++) {
    var phase = Object.keys(phases)[j];
    var tasks = phases[phase]['tasks'].map(i => [i.title]);
    var task_hours = phases[phase]['tasks'].map(i => [i.hours]);
    // Logger.log(phase);
    // Logger.log(tasks);

    var row = testSheet.getLastRow() + 1;

    var col = 1;
    var phase_range = 'A' + row + ':' + 'D' + (row);
    var tasks_range = 'B' + (row + 1) + ":" + "B" + (row + tasks.length);
    var task_hours_range = 'C' + (row + 1) + ":" + "C" + (row + tasks.length);

    testSheet.getRange(row, col).setValue((j + 1) + '-' + phase);
    testSheet.getRange(phase_range).setBackground('#599191').setFontColor('white');
    testSheet.autoResizeColumn(col);

    testSheet.getRange(tasks_range).setValues(tasks);
    testSheet.autoResizeColumn(col + 1);

    testSheet.getRange(task_hours_range).setValues(task_hours);
    testSheet.setColumnWidth(col + 2, 80);

    task_hours.forEach((i, index) => {
      per_total_hours += i[0];
      total_day = (per_total_hours / per_day_work_hour);

      var task_dates_range = 'D' + (row + index + 1) + ":" + "D" + (row + index + 1);
      testSheet.getRange(task_dates_range).setFormula("=SUM(C$1," + total_day + ")");
    })
    testSheet.setColumnWidth(col + 3, 160);
  }

  testSheet.getRange("C6").setValue(per_total_hours);
  testSheet.getRange("C2").setFormula("=SUM(C$1," + total_day + ")");

}

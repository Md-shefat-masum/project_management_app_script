function make_gant_chart() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // var sheet = ss.getSheets()[3];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('srs and costing');
  var lastRow = sheet.getLastRow();
  var sheetName = sheet.getSheetName();

  // phase = {
  //   "phase1": {
  //     "task1": {
  //       "sub_task1":{
  //         "sub_task_hour": 0,
  //         "sub_task_day": 0,
  //       }
  //     }
  //   }
  // }

  var phases = {};
  var tasks = [];
  var subtasks = [];
  var phase_index = '';
  var phase_task_index = '';
  var phase_sub_task_index = '';
  var total_task = 0;
  var total_sub_task = 0;

  for (var i = 4; i <= lastRow - 1; i++) {
    var data = sheet.getRange('A' + i + ':Y' + i).getValues(); // get full data range
    var phase = data[0][1];
    var task = data[0][2];
    var sub_task = data[0][3];
    var sub_task_hour = data[0][7];
    var sub_task_day = data[0][6];

    if (phase) {
      phase_index = phase;
      phases[phase_index] = {};
    }

    if (task) {
      phase_task_index = task;
      phases[phase_index][phase_task_index] = {};
    }

    if (sub_task) {
      phase_sub_task_index = sub_task;
      phases[phase_index][phase_task_index][phase_sub_task_index] = {
        sub_task_hour: 0,
        sub_task_day: 0,
      };
    }

    if (sub_task_hour) {
      phases[phase_index][phase_task_index][phase_sub_task_index]['sub_task_hour'] = sub_task_hour;
    }

    if (sub_task_day) {
      phases[phase_index][phase_task_index][phase_sub_task_index]['sub_task_day'] = sub_task_day;
    }
  }

  var gant_chartSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('gant_chart');
  var gant_chart_start_row = 12;
  var gant_chart_start_col = 16; // P16 column
  var gant_chart_last_row = gant_chartSheet.getLastRow() || 12; // gantt chart end row
  var gant_chart_last_col = gant_chartSheet.getLastColumn() || 16; // gantt chart end col
  var project_start_date = new Date(gant_chartSheet.getRange("B1").getValue()); // get project start days
  var project_init_day = 0; // count total completion days
  var gantt_start_col = 16; // gantt chart start col
  var project_max_day = 0; // project sub task max day

  /**
   * getRange(row, column, numRows, numColumns)
   * getRange('A1:D1')
   */
  var data_range = gant_chartSheet.getRange(gant_chart_start_row, gant_chart_start_col, gant_chart_last_row, gant_chart_last_col);

  /**
   * clear old data
   */
  data_range.clear();
  gant_chartSheet.getRange(11, gantt_start_col, 1, gant_chart_last_col).clear();

  /**
   * set phases
   */
  for (var j = 0; j < Object.keys(phases).length; j++) {
    var phase = Object.keys(phases)[j];
    // Logger.log(phase)
    /**
     * A12,A13,A14,...An
     */
    var phase_started_row = gant_chart_start_row;
    var range = `A${gant_chart_start_row}`;
    gant_chartSheet.getRange(range).setWrap(true).setValue(phase);

    /**
     * increase row no each phase print
     */
    gant_chart_start_row++;

    /**
     * set tasks
     */
    tasks = Object.keys(phases[phase]);
    for (var k = 0; k < tasks.length; k++) {
      total_task++;
      var task = tasks[k];
      // Logger.log(task)

      /**
       * B12,B13,B14,...Bn
       */
      var task_started_row = gant_chart_start_row;
      var range = `B${gant_chart_start_row}`;
      var progress_range = `N${gant_chart_start_row}`;
      gant_chartSheet.getRange(range).setWrap(true).setValue(task);

      /**
       * increase row no each task print
       */
      gant_chart_start_row++;

      /**
       * set subtasks
       */

      subtasks = Object.keys(phases[phase][task]);
      var is_done_rows = '';
      // Logger.log(phases[phase][task])
      for (var l = 0; l < subtasks.length; l++) {
        total_sub_task++;
        var subtask = subtasks[l];

        /**
         * C12, C13, C14, ...Cn
         */
        var range = `C${gant_chart_start_row}`;
        var start_date_range = `D${gant_chart_start_row}`;
        var end_date_range = `E${gant_chart_start_row}`;
        var work_time = `H${gant_chart_start_row}`;
        var total_day_range = `K${gant_chart_start_row}`; // completion days

        var assign_to_range = `L${gant_chart_start_row}`;
        var is_done_range = `M${gant_chart_start_row}`;
        is_done_rows += `M${gant_chart_start_row}+`; // M14+M15+M16+...

        sub_task_completion_days = phases[phase][task][subtask]["sub_task_day"];

        gant_chartSheet.getRange(range).setWrap(true).setValue(subtask);

        if (sub_task_completion_days) {

          try {
            createAssignToDropDown(assign_to_range);
            createIsDoneDropDown(is_done_range);
          } catch { }

          /**
           * check friday
           * if then date will increase one
           */
          project_start_date.setDate(project_start_date.getDate() + project_init_day);
          let date_day_day = project_start_date.getDay();
          if (date_day_day == 5) {
            project_init_day++;
          }

          gant_chartSheet.getRange(start_date_range).setNumberFormat("dd MMM, yyyy").setFormula("=SUM(B$1," + project_init_day + ")");

          project_init_day += sub_task_completion_days - 1;
          gant_chartSheet.getRange(end_date_range).setNumberFormat("dd MMM, yyyy").setFormula("=SUM(B$1," + project_init_day + ")");

          gant_chartSheet.getRange(work_time).setFormula(`=ms_to_hours(SUMIF(work_time_history!D$2:D,"=${gant_chart_start_row}",work_time_history!E$2:E))`);

          gant_chartSheet.getRange(total_day_range).setValue(sub_task_completion_days).setHorizontalAlignment("center");

          project_init_day++;

          // print gantt color by date range
          // gant_chartSheet.getRange(gant_chart_start_row,gantt_start_col,1,sub_task_completion_days)
          // .setBackground('#'+(Math.floor(Math.random() * 900) + 100));
          // gantt_start_col += sub_task_completion_days;

          // gantt_chart_print_time_range_by_color
          try {
            // gant_chartSheet.getRange(gant_chart_start_row, gantt_start_col, 1, Math.ceil(sub_task_completion_days))
              // .setBackground('#' + (Math.floor(Math.random() * 900) + 100));
          }
          catch {

          }
        }

        /**
         * increase row no each task print
         */
        gant_chart_start_row++;
      }
      /**
       * subtask end
       */
      gant_chartSheet.getRange(`B${task_started_row}:B${gant_chart_start_row - 1}`).merge().setHorizontalAlignment('center');
      // progress cell merge
      gant_chartSheet.getRange(`N${task_started_row}:N${gant_chart_start_row - 1}`).merge().setHorizontalAlignment('center');
      gant_chartSheet.getRange(`N${task_started_row}`)
        .setFormula(`=(${is_done_rows.substring(0, is_done_rows.length - 1)})*100/${subtasks.length}`);
    }
    /**
     * task end
     * task merge
     */
    gant_chartSheet.getRange(`A${phase_started_row}:A${gant_chart_start_row - 1}`).merge().setHorizontalAlignment('center');

  }
  /**
   * phase end
   */
  try {
    var last_col_name = gant_chartSheet.getRange(gant_chartSheet.getLastRow(), gant_chartSheet.getLastColumn()).getA1Notation();
    gant_chartSheet.getRange(`A12:${last_col_name}`).setVerticalAlignment('middle');
    gant_chartSheet.getRange(11, 9, 1, gant_chart_last_col).setHorizontalAlignment('center')
  } catch {

  }

  /**
   * dates list
   * printing date list side by side
   * appropiate for small project
   */
  // var project_init_day_for_printing_dates = new Date(gant_chartSheet.getRange("B1").getValue());
  // project_init_day_for_printing_dates.setDate(project_init_day_for_printing_dates.getDate() - 1);
  // for (var i = 9; i < project_init_day_for_printing_dates; i++) {
  //   project_init_day_for_printing_dates.setDate(project_init_day_for_printing_dates.getDate() + 1);
  //   let date = project_init_day_for_printing_dates.getDate();
  //   gant_chartSheet.getRange(11, i).setValue(date);
  // }
  // gant_chartSheet.setColumnWidths(9, i, 30);

  /**
   * get max col
   * and print max day no
   * guntt chart day no.s
   */
  // var max = Math.max.apply(null, gant_chartSheet.getRange("F12:F" + gant_chartSheet.getLastRow()).getValues().map(function (row) {
  //   return row[0];
  // }));
  // for (var i = 0; i < max; i++) {
  //   gant_chartSheet.getRange(11, gantt_start_col + i).setValue(i + 1);
  // }

  setProgressCalculateFormula(total_task);
  setIsDoneCalculateFormula(total_sub_task);
}

function get_developers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('man power');
  var range = sheet.getRange(`G5:G${sheet.getLastRow()}`);
  var values = range.getValues();
  return values.flat().filter(Boolean);
}

function createAssignToDropDown(range = null) {
  if (range) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("gant_chart");
    var range = sheet.getRange(range); // Replace "A1" with the cell where you want to create the dropdown
    var values = get_developers(); // Replace with your dropdown options
    var defaultValue = get_developers()[0]; // Replace with your default value
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
    // Create a validation rule with a default value

    range.setDataValidation(rule); // Set the validation rule on the range
    range.setValue(defaultValue); // Set the default value in the cell
  }
}

function createIsDoneDropDown(range = null) {
  if (range) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("gant_chart");
    var range = sheet.getRange(range); // Replace "A1" with the cell where you want to create the dropdown
    var values = [0, 1]; // Replace with your dropdown options
    var defaultValue = 0; // Replace with your default value
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
    // Create a validation rule with a default value

    range.setDataValidation(rule); // Set the validation rule on the range
    range.setValue(defaultValue); // Set the default value in the cell
  }
}

function setIsDoneCalculateFormula(sub_tasks_length = 0) {
  if (sub_tasks_length) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("gant_chart");
    sheet.getRange(`B2`).setValue(sub_tasks_length);
    var range = sheet.getRange(`B3`);
    range.setFormula(`=SUM(M14:M${sheet.getLastRow()})`);
  }
}

function setProgressCalculateFormula(tasks_length = 0) {
  if (tasks_length) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("gant_chart");
    var range = sheet.getRange(`N11`);
    range.setFormula(`=SUM(N13:N${sheet.getLastRow()})*100/(${tasks_length}*100)`);

    range = sheet.getRange(`B4`);
    range.setFormula(`=SUM(N13:N${sheet.getLastRow()})*100/(${tasks_length}*100)`);
  }
}


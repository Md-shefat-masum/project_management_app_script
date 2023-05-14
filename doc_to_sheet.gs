function readRange() {
  var {
    list_array,
    parents,

  } = make_list_to_array();
  Logger.log(list_array);


  const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/14eUpUkkxwvolqm-56FkjH888YzNUkawXxuJb1RupX3w/edit')
  const sheet = ss.getSheetByName('srs and costing');

  // let range = sheet.getRange('A1');
  // Logger.log(range.getValue());

  sheet.getRange(21,2,sheet.getLastRow(),sheet.getLastColumn()).clear().setBackground('#ffffff').setVerticalAlignment('middle');

  list_array.forEach((item,index)=>{
    var cell_range = sheet.getRange(21+index,2+item.depth);
    var day = item.day;
    if(item.depth > 2 && day){
      cell_range = sheet.getRange(21+index, 4);
    }else if(item.depth > 2 && !day){
      cell_range = sheet.getRange(21+index, 5);
    }
    cell_range.setValue(item.label).setWrap(true);

    if(item.label && item.depth == 2){
      cell_range.setBackground('#F5F5F5');
    }

    if(item.label && item.depth > 2 && day){
      sheet.getRange(21+index,6).setFormula("=$B$1").setHorizontalAlignment("center"); // per hour day
      sheet.getRange(21+index,7).setValue(+(day));
      sheet.getRange(21+index,7).setHorizontalAlignment("center"); // total day
      sheet.getRange(21+index,8).setFormula(`=F${21+index}*G${21+index}`); // total hour
      sheet.getRange(21+index,9).setFormula(`='man power'!C$10`); // per hour
      sheet.getRange(21+index,10).setFormula(`=H${21+index}*I$5`); // total
    }
  })
}
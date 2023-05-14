function make_list_to_array() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var lists = body.getListItems();
  var list_array = [];

  for (var i = 0; i < lists.length; i++) {
    let item = lists[i];
    if (item.getText() == "break") {
      break;
    }
    list_array.push({
      id: i + 1,
      label: item.getText().split('-')[0],
      day: item.getText().split('-').length > 1 ? parseFloat(item.getText().split('-')[1].trim()) : 0,
      depth: item.getNestingLevel(),
      parent: 0
    });
  }

  let root_id = list_array[0].id;
  list_array.forEach((item, index) => {
    if (item.depth > 0) {
      item.parent = root_id;
      if (list_array[index + 1] && list_array[index + 1].depth > item.depth) {
        root_id = item.id;
      }
    } else {
      root_id = item.id;
    }
  });

  let parents = list_array
    .filter((i) => i.parent == 0)
    .map((p) => {
      return {
        ...p
        ,
        child: childs(list_array.filter((i) => i.parent > 0), p)

      };
    });

  return {
    list_array,
    parents,
  }
  Logger.log(parents);
  Logger.log(list_array);

}

function childs(arr, item) {
  let temp = arr;
  try {
    temp = temp.filter((i) => i.parent == item.id)
      .map((i) => {
        return {
          ...i,
          child: childs(
            arr.filter((i) => i.parent != item.id),
            i
          ),
        };
      });

  } catch (e) {
    Logger.log(e)
  }

  return temp;
}

function check_has_children(array = [], item = {}) {
  return array.find((i) => i.parent === item.id);
}


//Schedule Data
//https://greenfield.target.com/l/card/1732305/zk3icio
//https://greenfield.target.com/l/card/1732305/sn3d96w

//Leader Data
//https://greenfield.target.com/l/card/1734371/eg4l8gp

//Training
//https://greenfield.target.com/l/card/1732386/ly0bjik


export function csvToArr(stringVal, splitter) 
{
    const [keys, ...rest] = stringVal
      .trim()
      .split("\n")
      .map((item) => csvSplit(item));
  
    const formedArr = rest.map((item) => {
      const object = {};
      keys.forEach((key, index) => (object[key] = item.at(index)));
      return object;
    });
    return formedArr;
}

//Splits the csv lines using custom algrotim to include commas in double quotes
function csvSplit(str) {  
  //split the str first  
  //then merge the elments between two double quotes  
  var delimiter = ',';  
  var quotes = '"';  
  var elements = str.split(delimiter);  
  var newElements = [];  
  for (var i = 0; i < elements.length; ++i) {  
      if (elements[i].indexOf(quotes) >= 0) {//the left double quotes is found  
          var indexOfRightQuotes = -1;  
          var tmp = elements[i];  
          //find the right double quotes  
          for (var j = i + 1; j < elements.length; ++j) {  
              if (elements[j].indexOf(quotes) >= 0) {  
                  indexOfRightQuotes = j; 
                  break;
              }  
          }  
          //found the right double quotes  
          //merge all the elements between double quotes  
          if (-1 != indexOfRightQuotes) {   
              for (var j = i + 1; j <= indexOfRightQuotes; ++j) {  
                  tmp = tmp + delimiter + elements[j];  
              }  
              newElements.push(tmp);  
              i = indexOfRightQuotes;  
          }  
          else { //right double quotes is not found  
              newElements.push(elements[i]);  
          }  
      }  
      else {//no left double quotes is found  
          newElements.push(elements[i]);  
      }  
  }  

  return newElements;  
}

//Input array then key and values array pairs
//input csv, key, [value1, value2,...]
export function filterCSV()
{
    var props = arguments;

    if(props.length < 3 || props.length % 2 != 1)
        return;

    const array = props[0];

    var newArr = new Array();

    array.forEach(element => 
    {
        var shouldAdd = true;
        for (let index = 1; index < props.length; index += 2) 
        {
            const key = props[index];
            const values = props[index + 1];

            var hasValue = false;
            for (let valIndex = 0; valIndex < values.length; valIndex++) 
            {            
                if(element[key] == values[valIndex])
                {
                    hasValue = true;
                    break;
                }
            }

            if(!hasValue)
            {
                shouldAdd = false;
                break;
            }
        }

        if(shouldAdd)
            newArr.push(element);
    });

    //console.log("Got filtered array with ", newArr.length, " elements");    

    return newArr;    
}

export function getUniqueElements(array, key)
{
    var newArr = new Array();

    array.forEach(element => 
    {
        if(element != undefined && !(element[key] == undefined) && element[key] != "undefined" && !newArr.includes(element[key]))
        {
            newArr.push(element[key]);
        }
    });

    newArr.sort();

    return newArr;
}

export function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export function dynamicSortMultiple() 
{
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

export function csvLookup(array, key, value)
{
    var data = {};
    array.forEach(row => {
        if(row[key] == value)
        {
            data = row;
            return;
        }
    });

    return data;
}

if(false && navigator.userAgent.match(/iPhone/i)) {
  altImage = $('#altImage');
  windowJS = $(window)
  window.setInterval(function(){
	if($(window).height() < $(document).height() ){
		altImage.css({position: "absolute",top:(windowJS.scrollTop()+windowJS.height()-altImage.height())+"px"})
	}
  }, 200)
}
var projectFixedElements = $('.altImage, .projectTopBar')

function fixedAyarla(){}
  
  
  
function themize(datas, themeHTML, deployee){
	var themeHTML		= $(themeHTML)[0].outerHTML;
	var themes			= '';
	for(i in datas){
		var theme = themeHTML;
		datas[i].i = i
		for(ii in datas[i]){
			var re = new RegExp('{'+ii+'}','g');
			theme = theme.replace(re, datas[i][ii]);
		}
		themes += theme;
	}
	$(deployee).html(themes+' ');
}
function themizeReturn(datas, themeHTML){
	var themeHTML		= $(themeHTML)[0].outerHTML;
	var themes			= '';
	for(i in datas){
		var theme = themeHTML;
		datas[i].i = i
		for(ii in datas[i]){
			var re = new RegExp('{'+ii+'}','g');
			theme = theme.replace(re, datas[i][ii]);
		}
		themes += theme;
	}
	return themes;
}
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}
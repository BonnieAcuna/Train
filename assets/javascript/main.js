$(document).ready(function(){
var trainData;
var potentialTrains = localStorage.getItem('trains');
if(potentialTrains) {
	var trains = JSON.parse(potentialTrains);
	trains.forEach((train, index) => {
		createRow(train, index);
	});
	trainData = trains;
}
else {
	trainData = [];
}

$("#select").on('click', function(event) {
	event.preventDefault();
	var trainName = $('#trainname').val().trim();
	var destination = $('#destination').val().trim();
	var trainTime = $('#traintime').val().trim();
	var frequency = $('#frequency').val().trim();

	console.log(trainName);
    console.log(destination);
    console.log(trainTime);
    console.log(frequency);
	
	//localStorage.clear("trains");
	//do calculations here
	var nextArrival;
	var minutesAway;
	//trainTime is first time train goes
	//frequency is the interval in which is arrives
	var timeArray = trainTime.split(':');
	var newTrainTime = moment().hours(timeArray[0]).minutes(timeArray[1]);
	var maxMoment = moment.max(moment(), newTrainTime);
	
	 // If the first train is later than the current time, sent arrival to the first train time
	 if (maxMoment === newTrainTime) {
		nextArrival = newTrainTime.format("hh:mm A");
		minutesAway = newTrainTime.diff(moment(), "minutes");
		console.log("equal")
	  } else {
	
		console.log('not equal')
		var diffTimes = moment().diff(newTrainTime, "minutes");
		var remainder = diffTimes % frequency;
		minutesAway = frequency - remainder;
		
		nextArrival = moment().add(minutesAway, "m").format("hh:mm A");
		console.log(nextArrival)

	  }
	  console.log("minutesAway:", minutesAway);
	  console.log("nextArrival:", nextArrival);

	var newTrain = {
		train: trainName,
		destination: destination,
		trainTime: trainTime,
		frequency: frequency,
		nextArrival: nextArrival,
		minutesAway: minutesAway,
	}
	trainData.push(newTrain);
	localStorage.setItem("trains", JSON.stringify(trainData));
	
	console.log(newTrain);

	$('#trainname').val("");
	$('#destination').val("");
	$('#traintime').val("");
	$('#frequency').val("");
	createRow(newTrain, trainData.length-1);

	
});


  

  function createRow(trainObj, i) {
	var tRow = $("<tr>");
	var nameTd = $("<td>").text(trainObj.train);
	tRow.append(nameTd);
	var destinationTd = $("<td>").text(trainObj.destination);
	tRow.append(destinationTd);
	var timeTd = $("<td>").text(trainObj.nextArrival);
	tRow.append(timeTd);
	var frequencyTd = $("<td>").text(trainObj.frequency);
	tRow.append(frequencyTd);
	var nextArrival = $("<td>").text(trainObj.minutesAway);
	tRow.append(nextArrival);
	var remove = $("<button><i class='icon icon-delete'></i></button>");
	remove.addClass("removebutton");	
	remove.attr('data-i', i)				
	tRow.append(remove);

	$("tbody").append(tRow);
	  
}

$(document).on('click', ".removebutton", function () {
	let index = $(this).attr('data-i');
	$(this).parent().remove();
	console.log(index);
	trainData.splice(index, 1);
	localStorage.setItem("trains", JSON.stringify(trainData));
	location.reload();
	// removeRow.remove();
});


});



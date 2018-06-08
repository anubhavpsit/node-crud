#1 : There should be three parameter in the request 
	time [interger]
	userid [integer]
	data [JSON Format]
Then only data will be saved else the error will be returned

#2 : If hit is coming for the same time then the data will be replaced with the new one (We are writing file not appending the data).

#3 : Authetication is very basic send this in Auth-Key in header with the value => 7cab2267ab2cf19c4b6eaa0ce02d9f0e

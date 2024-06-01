//############################
// READ AND WRITE TO CSV
//############################

function read_csv(filepath) {
    const fs = require('fs');
    const papa = require('papaparse');

    const f = fs.readFileSync(filepath, 'utf8');
	
    let arr = [];
    papa.parse(f, {header: true, 
		   step: function(result) {arr.push(result.data);} });
    return arr;
}


function write_csv(filepath, data) {
    const fs = require('fs');
    const papa = require('papaparse');
		
    const data1 = papa.unparse(data, {header: false});
	
    fs.appendFile( filepath, 
		  '\n' + data1, 
		  (err) => { if (err) { return console.log('Error: ', err); } } 
		 );
    return;
}

//###################
// USER INPUT
//###################
	
function user_input(s) {
    const rs = require('readline-sync');
    return rs.question(s);	
    //return s;	
}

//###################
// CHANGE STRING CASE
//###################

function convert_to_titlecase(s) {	
    let arr = s.split(' ');
	
    let arr_titlecase = [];
    for (const s1 of arr) {
        arr_titlecase.push( s1.charAt(0).toUpperCase() + s1.substring(1) );
    }
	
    if (arr_titlecase.length === 1) { 
	    return arr_titlecase[0]; 
    } else { 
	    return arr_titlecase.join(' '); 
    }
}

//###################
// VALIDATE 
//###################

function validate_name(s) {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let whitespace = ' ';
	
    let letters = upper + lower + whitespace;
    let lettersArr = letters.split('');
	
    for (let i = 0; i < s.length; i++) {   	
        if ( !lettersArr.includes(s.charAt(i)) ) { return false; }
    }
    return true;    
}


function validate_year(s) {
    let digitsArr = '0123456789'.split('');
	
    for (let i = 0; i < s.length; i++) {   
        if ( !digitsArr.includes(s.charAt(i)) ) { return false; }
    }
	
    if (parseInt(s) >= 1960 && parseInt(s) <= 2024) {
        return true;
    } else {
        return false;
    }
}

//############################
// PRINT RECORDS
//############################

function print_records(arr) {
    console.log('NAME \t\tGENDER \tBIRTH YEAR');
	
    for (const i of arr) {
	if (i['name'].length >= 7) {
	    console.log(`${i['name']} \t${i['gender']} \t${i['birthyear']}`);
	} else {
	    console.log(`${i['name']} \t\t${i['gender']} \t${i['birthyear']}`);
	}
    }
}
	
//###################
// ENTER RECORD FIELD
//###################

function enter_name() {	
    let s = user_input('Enter the name: ');
	
    let valid = validate_name(s);	
    while (!valid) {                                                 
        s = user_input('Invalid entry. Enter a name with all letters: ');
        valid = validate_name(s);
    }
    return s;
}


function enter_gender() {
    let s = user_input('Enter the gender: ');	         
    
    while ( !['f','m','F','M'].includes(s) ) {
        s = user_input('Invalid entry. Enter the gender m or f: ');
    }
    return s;
}


function enter_birthyear() {
    let s = user_input('Enter the birth year: ');
	
    let valid = validate_year(s);
    while (!valid) {
        s = user_input('Invalid entry. Enter a year from 1960 to 2024: ');
        valid = validate_year(s);
    }
    return s;
}

//###################
// 3. SEARCH
//###################

function match_name(allDataArr, s) {
    let matchedArr = [];
	
    for (const i of allDataArr) {				
        recordArr = i['name'].toLowerCase().split(' ');
        if (recordArr.length === 1) { 
	    if (i['name'].toLowerCase() == s.toLowerCase()) { matchedArr.push(i); }
		
	} else {
	    if (recordArr.indexOf(s) > -1) {matchedArr.push(i);}
	    // ANOTHER METHOD
	    // if (recordArr.includes(s)) {matchedArr.push(i);}	
	}	
    }
    return matchedArr;	
}


function match_record(allDataArr, key, s) {
    let matchedArr = [];
    if (key === 'name') {
        matchedArr = match_name(allDataArr, s);
		
    } else {
	for (const i of allDataArr) {
	    if (i[key].toLowerCase() == s.toLowerCase()) { matchedArr.push(i); }
	}
    }
    return matchedArr;
}	
	

function search_database(arr, x, s) { 
    let arr1 = [];
    if (x === '1') {  
        arr1 = match_record(arr, 'name', s);
		
    } else if (x === '2') {                     
        arr1 = match_record(arr, 'gender', s);
		
    } else { 
        arr1 = match_record(arr, 'birthyear', s);
    }   
    return arr1;
}
	

function enter_query(x) {
    let s = '';
    if (x === '1') {
	s = enter_name();
    } else if (x === '2') {
        s = enter_gender();
    } else if (x === '3') {
        s = enter_birthyear();
    } else {
	return s;
    }
    return s;
}
	
	
function select_search_field() {
    console.log('DATA SEARCH');
    console.log('-----------');
    console.log('1. Search by name.');
    console.log('2. Search by gender.');
    console.log('3. Search by birth year.');
    console.log('4. Exit search.');
 
    let s = user_input('\nSelect an option (1, 2, 3 or 4): ')
    
    while (!['1', '2', '3', '4'].includes(s)) {
        s = user_input('Invalid entry. Enter 1, 2, 3 or 4: ');
    }
    return s;
}	


function another_search() {
    console.log();
    let s = user_input('Do you want to do another search (y/n)? ');
    
    console.log();
    while ( !['y', 'n', 'Y', 'N'].includes(s) ) { 
	s = user_input('Invalid entry. Enter y or n: '); 
    }
    return s; 
}	


function search(DATA_PATH) {    
    // STEP 1
    let arr = read_csv(DATA_PATH);
	
    // loop keeps iterating until the user selects 'n' in STEP 7.
    while (true) {
	let x = '';
	let s = '';
	let resultArr = [];
		
        // STEP 2
        x = select_search_field();
		
        // STEP 3
	console.log();
        s = enter_query(x); 
		
        // STEP 4
	if (s.length > 0) {
	    resultArr = search_database(arr, x, s); 		
        } else {
	    return;
	}
		
        // STEP 5
	if (resultArr.length === 0) {
	    console.log('\nThere are no records matched.');
	} else {
	    console.log('\nMATCHED RECORDS');
            console.log('---------------');
            print_records(resultArr);
	}
           
        // STEP 6
        x = another_search();
        
        // STEP 7
        if (x === 'n' || x === 'N') {return;}
    }
    return;
}

//#####################
// 2. ENTER NEW RECORDS
//#####################

function enter_another_record() {
    console.log();    
    let s = user_input('Do you want to enter another record (y/n)? ');
	
    console.log();
    while ( !['y', 'n', 'Y', 'N'].includes(s) ) {
	s = user_input('Invalid entry. Enter y or n: ');
    }        
    return s;
}


function enter_record() {    
    let arr = [];
    let n = enter_name();
    let g = enter_gender();
    let y = enter_birthyear();
	
    let record = {'name': convert_to_titlecase(n), 'gender': g.toUpperCase(), 'birthyear': y};
    arr.push(record);

    let yes_no = enter_another_record();
    
    while ( ['y', 'Y'].includes(yes_no) ) {		
        n = enter_name(); 
        g = enter_gender(); 
        y = enter_birthyear();
		
	record = {'name': convert_to_titlecase(n), 'gender': g.toUpperCase(), 'birthyear': y};
        arr.push(record);
        
        yes_no = enter_another_record();
    }
    
    console.log('RECORDS ENTERED');
    console.log('---------------');
    print_records(arr);
                         
    return arr;
}

//############################
// 1. RETRIEVE, PRINT RECORDS
//############################

function retrieve_all_data(filepath) {
    let arr = read_csv(filepath);
	
    console.log('ALL RECORDS');
    console.log('-----------');
    print_records(arr);

    console.log('\nNumber of records:', arr.length);
}		
		
//#################
// USER OPTIONS
//#################
		
function select_option() {
    console.log('STUDENT DATABASE');
    console.log('----------------');
    console.log('1. Retrieve all records.');
    console.log('2. Enter a new record.');
    console.log('3. Search for a record.');
    console.log('4. Exit.');
		
    let s = user_input('\nSelect an option (1, 2, 3 or 4): ');
	
    while (!['1', '2', '3', '4'].includes(s)) {
        s = user_input('Invalid entry. Enter 1, 2, 3 or 4: ');
    }
    return s;
}

//###################
// MAIN
//###################

function main() {
    let DATA_PATH = '../data/data.csv';
	
    while (true) {    
	console.log();
	let x = select_option();
	let arr = [];
	
	if (x === '1') {
	    console.log();
            retrieve_all_data(DATA_PATH);

	} else if (x === '2') {
	    console.log();
            arr = enter_record();
	    write_csv(DATA_PATH, arr);
	    console.log('\nExiting application to update database. Please come again.');
	    return;
     
        } else if (x === '3') {
            console.log();
            arr = search(DATA_PATH);
		
        } else if (x === '4') {		
	    console.log('\nExiting application. Please come again.');
            return;	
        } 
    }
}

main()

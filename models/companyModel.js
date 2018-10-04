var db = require('./db_connection');

// db.query('SELECT * FROM store_master', function(err, result) {
//     if (err) throw err;
//     console.dir("AAAAAAAAAA");
//     console.dir(result);
//   });


// var stores = {
//         getAllStores: () => {
//             db.query('SELECT * FROM store_master', function(err, result) {
//                 if (err) throw err;
//                 //console.dir("BBBBBBBBBBBBBBBCCCCCCCCCCCCC");
//                 //console.dir(result);
//                 return result;
//             });
//         },
//         getActiveCompany: () => {
//             var a = [1,2,3,4,5,6];
//             return a;
//         },
//     };


// exports.getAllStores = function(done) {
//     db.get().query('SELECT * FROM store_master', function (err, rows) {
//       if (err) return done(err)
//       done(null, rows)
//     })
// }

// exports.getAllStores = function() {
//     db.get().query('SELECT * FROM store_master', function (err, rows) {
//       if (err) throw err;
//       return rows;
//     })
// }




// var data = {
//     getAllStores: getAllStores(db)
// }

// function a(){
//     return 55;
// }
// function getAllStores(db) {
//     var data = 'AASAS';
//    db.query('SELECT store_name FROM store_master WHERE store_id = 1', function(err, result) {
//         if (err) throw err;
//         // console.dir("AAAAAAAAAA");
//         //console.dir(result);
//         data = result;
//     });
//     return data;
// }


// console.dir("B");
// console.dir(data);
// console.dir("B");


function getData(callback) {
    db.query('SELECT * FROM company_master order by company_id desc', function(err, res, fields) {
        callback(err, res);
    });
}

function saveCompanyData(data, callback) {

    var postData = [
        data.company_name,
        data.contact_number,
        data.email,
        data.tan,
        data.pan,
        data.gst];

    db.query('INSERT INTO company_master (\
        company_name,contact_number,email,\
        tan_number, pan_number, gst_number) VALUES (?, ?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) throw err
            callback(err, result);
      });

}

module.exports = {
    getData: getData,
    saveCompanyData: saveCompanyData
}



//exports.Stores = data;
//module.exports = stores;
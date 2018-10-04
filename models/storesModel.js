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
    db.query('SELECT * FROM store_master order by store_id desc', function(err, res, fields) {
        callback(err, res);
    });
}

function saveStoreData(data, callback) {

    // db.query('SELECT * FROM store_master', function(err, res, fields) {
    //     callback(err, res);
    // });
    var postData = [
        data.store_name,
        data.store_type,
        data.store_type,
        data.company_name,
        data.store_manager_name,
        data.store_owner_name,
        data.store_mobile_number,
        data.store_phone_number,
        data.store_email,
        data.address_1,
        data.address_2,
        data.city];

    db.query('INSERT INTO store_master (\
        store_name,store_type_id,company_id,\
        store_manager_name, store_owner_name, mobile_number, phone_number,\
        email, address1, address2, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', postData, function(err, result) {
        if (err) throw err
            callback(err, result);
      });
//     { store_name: 'adsd',
//     store_type: '1',
//     company_name: '1',
//     store_manager_name: '',
//     store_mobile_number: '',
//     store_owner_name: '',
//     store_phone_number: '',
//     store_email: '',
//     address_1: '',
//     address_2: '',
//     pin_code: '',
//     city: '',
//     state: '0',
//     country: '0' 
// }
  
}

module.exports = {
    getData: getData,
    saveStoreData: saveStoreData
}



//exports.Stores = data;
//module.exports = stores;
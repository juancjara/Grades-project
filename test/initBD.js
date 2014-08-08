var seed = require('./seed.js');

seed.init('mongodb://localhost/gradesDB', function(err){
    if(err) return console.log(err);
});
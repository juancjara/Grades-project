var seed = require('./seed.js');

seed.init('mongodb://localhost/gradesDB', function(err) {
    if(err) console.log(err);
});
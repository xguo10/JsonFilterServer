/*
Unit test scripts.
*/

var chai = require('chai');
var expect = chai.expect;
var filter = require("../libs/filter.js");
var data = require("./data.js");

chai.use(require('chai-json-schema'));

var bodySchema = {
    "title": "JSON data filtering result schema",
    "type": "object",
    "required": ["image", "slug", "title"],
    "additionalProperties": false,
    "properties": {
        "image": {
            "type": "string",
            "minItems": 1,
            "uniqueItems": true,            
        },
        "slug": {
            "type": "string",
            "minItems": 1,
            "uniqueItems": true,
        },
        "title": {
            "type": "string",
            "minItems": 1,
            "uniqueItems": true,
        }
    }
      
};

 
describe("Filter", function(){
   describe("#metadataFilter()", function(){
        it(" should function be defined ", function() {        
            expect(filter.metadataFilter).to.be.defined;
        });
        it(" should handle bad data with exceptions", function() {            
            var fn = function(){ filter.metadataFilter(data.getInvalidJSON()); };
            expect(fn).to.throw(Error);
        });
        it(" should return an array of objects", function() {
            var results = filter.metadataFilter(data.getValidJSON());
            expect(results).to.be.a('array'); 
            for(var i = 0; i<results.length; i++ ){
                result = results[i];
                expect(result).to.be.an('object');
           }
        });
        it(" should return object with three string properties: 'image', 'slug', 'title' ", function() {
            var results = filter.metadataFilter(data.getValidJSON());
            for(var i = 0; i<results.length; i++ ){
                result = results[i];
                expect(result).to.be.jsonSchema(bodySchema);
                expect(result.image).to.be.a('string');
                expect(result.slug).to.be.a('string');
                expect(result.title).to.be.a('string');
           }
        });
        it(" should pick up object with (drm: true) and (episodeCount > 0).", function() {
            var titles = [];
            var payload = data.getValidJSON().payload;
            for(var i = 0; i<payload.length; i++ ){
                p = payload[i];
                if(p.drm == true && p.episodeCount>0)
                    titles.push(p.title);
            }
            var results = filter.metadataFilter(data.getValidJSON());
            for(var i = 0; i<results.length; i++ ){
                result = results[i];                
                expect(titles).to.include(result.title);
            }
        });
        
        
   }); 
});
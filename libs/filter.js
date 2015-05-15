exports = module.exports = {};
/**
     * filter out the data with (drm: true) and at least one episode (episodeCount > 0).
     * @method metadataFilter
     * @param {Object} JSON data
     * @return a list of objects
*/
function  metadataFilter(data){
    var list = [];    
    try{
        payloadList = data.payload;
        for(var i = 0; i< payloadList.length; i++){
            load = payloadList[i];
            //console.log("load = " + JSON.stringify(load))
            if(load.drm == true && load.episodeCount>0 && load.slug &&
                load.title && load.image && load.image.showImage){
                var element = {};
                element['image'] = load.image.showImage;
                element['slug'] = load.slug;
                element['title'] = load.title;
                //element['drm'] = load.drm;
                //console.log("element = " + JSON.stringify(element))
                list.push(element);							
            }
        }
    }
    catch (e) {
        //console.log("element = " + JSON.stringify(e))
        throw e;
    }
    
    return list;
}

exports.metadataFilter = metadataFilter;
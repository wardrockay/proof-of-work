/* Address js file. */    
// utils/address.js
var AddressUtilities = function AddressUtilities(){

  var self = this;

  this.parseAddress = parseAddress;

  function parseAddress(address){
    address = address.replace('localhost','192.168.1.1');
    var addressAndPortRegex = /(([012]{0,1}[0-9]{1,2}\.){3}[012]{0,1}[0-9]{1,2}):[0-9]{3,4}/;
    if(address.match(addressAndPortRegex)[0]){
      return {host: address.match(addressAndPortRegex)[0].split(':')[0], port: address.match(addressAndPortRegex)[0].split(':')[1]};
    } else {
      return address;
    }
  }

  if(AddressUtilities.caller != AddressUtilities.getInstance){
		throw new Error("This object cannot be instanciated");
	}

};


AddressUtilities.instance = null;
AddressUtilities.getInstance = function(){
	if(this.instance === null){
		this.instance = new AddressUtilities();
	}
	return this.instance;
};

module.exports = AddressUtilities.getInstance();

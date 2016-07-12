/**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 *
 * Package    : core/js
 * Filename   : encryptor.js
 * 
 * Good luck trying to hack RSA!
 * 
 */

function encrypt(password){
	var encrypted = compute("encrypt", password);
	return encrypted;

	function formatString(str)
	{
	  var tmp='';
	  for(var i=0;i<str.length;i+=80)
	    tmp += '   ' + str.substr(i,80) +'\n';
	  return tmp;
	}

	function showData(tree) {
	  var data = '';
	  var val = '';
	  if(tree.value)
	   val = tree.value;
	  data += tree.type + ':' +  val.substr(0,48) + '...\n';
	  if(tree.sub)
	    for(var i=0;i<tree.sub.length;i++)
	      data += showData(tree.sub[i]);
	  return data;
	}

	function certParser(cert){
	  var lines = cert.split('\n');
	  var read = false;
	  var b64 = false;
	  var end = false;
	  var flag = '';
	  var retObj = {};
	  retObj.info = '';
	  retObj.salt = '';
	  retObj.iv;
	  retObj.b64 = '';
	  retObj.aes = false;
	  retObj.mode = '';
	  retObj.bits = 0;
	  for(var i=0; i< lines.length; i++){
	    flag = lines[i].substr(0,9);
	    if(i==1 && flag != 'Proc-Type' && flag.indexOf('M') == 0)//unencrypted cert?
	      b64 = true;
	    switch(flag){
	      case '-----BEGI':
	        read = true;
	        break;
	      case 'Proc-Type':
	        if(read)
	          retObj.info = lines[i];
	        break;
	      case 'DEK-Info:':
	        if(read){
	          var tmp = lines[i].split(',');
	          var dek = tmp[0].split(': ');
	          var aes = dek[1].split('-');
	          retObj.aes = (aes[0] == 'AES')?true:false;
	          retObj.mode = aes[2];
	          retObj.bits = parseInt(aes[1]);
	          retObj.salt = tmp[1].substr(0,16);
	          retObj.iv = tmp[1];
	        }
	        break;
	      case '':
	        if(read)
	          b64 = true;
	        break;
	      case '-----END ':
	        if(read){
	          b64 = false;
	          read = false;
	        }
	      break;
	      default:
	        if(read && b64)
	          retObj.b64 += pidCryptUtil.stripLineFeeds(lines[i]);
	    }
	  }
	  return retObj;
	}

	function compute(mode, input){
	  var theForm = window.document.theForm;
	  var crypted = input;
	  
var public_key  = '-----BEGIN PUBLIC KEY-----\n\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDuBzaonUdWpV8CZm0Ju1qoSYmc\n\
bbWE+ew26yYSf18Mq+3pjw+t9+YgiDjtgYeponDWVxYiplmQImPz9yG8MWUxU8Ye\n\
YjI5l/a6Jg/+I0qrxDCiPZNmNYtw1S3dm63Zm4KmRhkuE+qgynSygNBnamwN/71E\n\
tamyHK+1AjkBqYsE/QIDAQAB\n\
-----END PUBLIC KEY-----';
	  
	  var params = {};
	  var result = '';
	  var color = '';

	  switch(mode){
	    case 'encrypt':
	      params = certParser(public_key);
	      if(params.b64){
	        var key = pidCryptUtil.decodeBase64(params.b64);
	        var rsa = new pidCrypt.RSA();
	        var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key));
	        var tree = asn.toHexTree();
	        rsa.setPublicKeyFromASN(tree);
	        crypted = rsa.encrypt(input);
	        crypted = pidCryptUtil.fragment(pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(crypted)),64);
	        
	        return crypted;
	       } else alert('Could not find public key.');
	     break;
	    
	  }
	}
}
    
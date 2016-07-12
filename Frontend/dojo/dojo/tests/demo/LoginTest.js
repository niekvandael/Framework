define(["doh", "dojo/demo/LoginTest"]
	,function(doh){
	debugger;
		doh.register("tests.demo.loginTests", [
           {
               name: "valid user",
               setUp: function(){
            	   this.user = "test";
            	   this.password = "test";
               },
               runTest: function(){
            	   alert('nu ist goe');
            	   doh.assertEqual("test", this.user);
            	   doh.assertEqual("test", this.password);
               },
               tearDown: function(){
            	   //TODO what after the test is finished?
               }
           }
		]);
});
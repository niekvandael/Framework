
dohSeleniumRunnerOptions = {
    // comma-separated list of test modules - this is handled by DOH's 
    //  runner.html. To test dojo core use 'dojo.tests.module'
    tests: "dojo.tests.module2",
    
    // base url of runner.html accessible from all browsers/hosts
    //rootUrl : "http://172.0.20.86/~rcoup/dojo_TRUNK/util/doh/",
    rootUrl : "C:/Workspaces/LOCALRTC2/CustomSystem/dojo/util/doh/",
    
    // timeout for running tests
    timeout : 180000,
    
    // use a thread for each browser? 
    //  helps a lot if you have more than one machine.
    multiThread: true,
    
    // browser definitions
    //  format: 'browser name/description': { ... definition ... }
    //
    //  The Selenium-RC server must be running on each of the machines below, 
    //  but one instance can launch multiple browser instances.
    //
    //  The host, port, and browser are passed to selenium - see the section
    //  'Automatically launching other browsers' at http://www.openqa.org/selenium-rc/tutorial.html
    //
    //  *name refers to the default install location/setup of each browser on any platform
    //
    browsers : {
        "Firefox 2/OSX" : { host:"localhost", port:4444, browser:"*firefox" },
        //"Safari 3/OSX" : { host:"localhost", port:4444, browser:"*safari" },
        //"Opera 9.25/OSX" : { host:"localhost", port:4444, browser:"*opera" },

        "Internet Explorer 7/XP" : { host:"localhost", port:4444, browser:"*iexplore" },
        //"Safari 3/XP" : { host:"192.168.248.130", port:4444, browser:"*safari" },
        "Opera 9.25/XP" : { host:"localhost", port:4444, browser:"*opera" },
        "Firefox 2/XP" : { host:"localhost", port:4444, browser:"*firefox" }
    }
};

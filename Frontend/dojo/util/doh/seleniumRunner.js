var dohSel = {};

// DRY so lets use things from buildscripts
load("../buildscripts/jslib/logger.js");
// Selenium runner
importClass(Packages.com.thoughtworks.selenium.DefaultSelenium);
// Threads!
importClass(java.lang.Thread,
            java.lang.Runnable,
            java.lang.System);

logger.info("Welcome to the DOH Selenium-RC runner.");

if (!arguments.length) {
    logger.error("You need to specify a config file to use.");
    quit(3);
} else {
    var configFile = arguments[0];
    logger.info("Loading config file: " + configFile);
    load(configFile);

    if (typeof dohSeleniumRunnerOptions == "undefined") {
        logger.error("dohSeleniumRunnerOptions wasn't defined after loading the config file.");
        quit(3);
    }
    dohSel.options = dohSeleniumRunnerOptions;
}

dohSel.runTest = function(testModules, browserId) {
    var url = dohSel.options.rootUrl + "runner.html?testModule=" + testModules;
    logger.info("Testing " + testModules + " in " + browserId + "...");
    logger.trace(url);
    
    var sel = dohSel._browsers[browserId];
    sel.open(url);
    sel.waitForPageToLoad("5000");
    
    // set up a 'completed' flag that selenium can watch for
    // d.connect doesn't work properly in IE when you do it from here, so we use
    // this hack method.
    Thread.sleep(1000);
    sel.getEval("window.dohIsComplete = false;");
    sel.getEval("window.oldDohOnEnd = window.doh._onEnd;");
    sel.getEval("window.doh._onEnd = function() { window.dohIsComplete = true; window.oldDohOnEnd.apply(window.doh); };");
    
    // wait for all the tests to finish
    sel.waitForCondition("window.dohIsComplete", dohSel.options.timeout);
    
    // get the results
    var testCount = Number(sel.getEval("window.doh._testCount"));
    var failCount = Number(sel.getEval("window.doh._failureCount"));
    var errorCount = Number(sel.getEval("window.doh._errorCount"));

    logger.info("Results for " + testModules + " (" + browserId + "):\n"
        + "\tTests: " + testCount
        + "\tPassed: " + (testCount - failCount - errorCount)
        + "\tFailed: " + failCount
        + "\tErrors: " + errorCount);
    
    dohSel._results[browserId] = (failCount == 0 && errorCount == 0);
};

dohSel.createTestRunnable  = function(browserId) {
    // summary: create a Java thread for a particular browser
    var runnable = new Runnable()[ {
    	run : function() {
            try {
                dohSel.runTest(dohSel.options.tests, browserId);
            } catch (e) {
                logger.error("Got an error: " + browserId + "\n" + e);
                returnCode = 2;
            }
        }
    }];
    var thread = new Thread(runnable);
    return thread;
};

dohSel.run = function() {
    // summary: Run the tests
    // returns: an exit code - 0=success, 1=test failures/errors, 2=error running the tests (network, etc)
    
    dohSel._browsers = {};
    dohSel._results = {};
    var returnCode = 0;
    var runners = [];
    
    try {
        // spawn all our browsers first
        for (var browserId in dohSel.options.browsers) {
            var bSpec = dohSel.options.browsers[browserId];
            logger.info("Creating browser: " + browserId + " ...");
            var bSel = new DefaultSelenium(bSpec.host, bSpec.port, bSpec.browser, dohSel.options.rootUrl);
            bSel.start();
            dohSel._browsers[browserId] = bSel;
        } 
    
        for (var b in dohSel._browsers) {
            if (dohSel.options.multiThread) {
                // create a thread
                var thread = dohSel.createTestRunnable(b);
                runners.push(thread);
                thread.start();
            } else {
                // just do it
                try {
                    dohSel.runTest(dohSel.options.tests, b);
                } catch (e) {
                    logger.error("Got an error: " + b + "\n" + e);
                    returnCode = 2;
                }
            }
        }

        // wait for any threads to terminate        
        for (var i=0; i<runners.length; i++) {
            runners[i].join();
        }
        
    } catch(e) {
        logger.error("Got an error:\n" + e);
        returnCode = 2;
    }

    // Kill off all our selenium browsers
    for (var b in dohSel._browsers) {
        logger.info("Terminating browser: " + b);
        dohSel._browsers[b].stop();
    }
    
    // Build our returncode from the success of each browser
    if (returnCode == 0) {
        for (var b in dohSel._results) {
            if (!dohSel._results[b]) {
                returnCode = 1;
                break;
            }
        }
    }
    
    return returnCode;
};
var retCode = dohSel.run();
logger.info("Exiting with result code: " + retCode);
quit(retCode);

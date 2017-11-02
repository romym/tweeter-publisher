var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();

monitoring.on('initialized', function (env) {
    env = monitoring.getEnvironment();
    for (var entry in env) {
        console.log(entry + ':' + env[entry]);
    };
});
 
monitoring.on('cpu', function (cpu) {
    console.log('[' + new Date(cpu.time) + '] CPU: ' + cpu.process);
});
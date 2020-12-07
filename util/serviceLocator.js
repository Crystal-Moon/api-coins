const argsList = require('get-function-arguments');

module.exports = function () {
    const dependencies = {};
    const factories = {};
    const di = {
        factory,
        register,
        inject,
        get
    };
    function factory(name, factory) {
         factories[name] = factory;
    }
    function register(name, dependency) {
        dependencies[name] = dependency;
        //console.log('registrado', dependencies[name])
    }
    function inject(factory) {
        const arr1= argsList(factory);
        //console.log('arr1',arr1)
        const args = argsList(factory).map(dependency => di.get(dependency));
     //   console.log('los args',args)
     //   console.log('la fac creada',factory.apply(null, args))
        return factory.apply(null, args);
    }
    function get(name) {
        //console.log('dependencias listas', JSON.stringify(dependencies))
        if (!dependencies[name]) {
            const factory = factories[name];
           // console.log('la factoria', factory.toString())
            dependencies[name] = factory && di.inject(factory);
            
           // console.log('guardado dependencia',dependencies[name])
            if (!dependencies[name]) {
                throw new Error(`No existe '${name}' módulo en el Inyector`);
            }
        }
        return dependencies[name];
    }
    return di;
}
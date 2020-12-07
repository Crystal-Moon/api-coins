const argsList = require('get-function-arguments');

module.exports = ()=>{
    const dependencies = {};
    const factories = {};
    const di = {
        factory,
        register,
        inject,
        get
    };
    factory: (name, factory)=> {
         factories[name] = factory;
    }
    register: (name, dependency)=> {
        dependencies[name] = dependency;
    }
    inject: (factory)=> {
        const args = argsList(factory).map(dependency => di.get(dependency));
        return factory.apply(null, args);
    }
    get: (name)=> {
        if(!dependencies[name]) {
            const factory = factories[name];
            dependencies[name] = factory && di.inject(factory);

            if (!dependencies[name]) throw new Error(`No existe '${name}' módulo en el Inyector`);
        }
        return dependencies[name];
    }
    return di;
}
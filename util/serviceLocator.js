module.exports = function () {
    const dependencies = {};
    const factories = {};
    const serviceLocator = {
        factory,
        register,
        get
    };
    function factory(name, factory) {
         factories[name] = factory;
    }
    function register(name, dependency) {
        dependencies[name] = dependency;
    }
    function get(name) {
        if (!dependencies[name]) {
            const factory = factories[name];
            dependencies[name] = factory && factory(serviceLocator);
            
            if (!dependencies[name]) {
                throw new Error('No existe este módulo en el SL');
            }
        }
        return dependencies[name];
    }
    return serviceLocator;
}
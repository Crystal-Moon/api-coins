module.exports = {
	name: {
		type: 'string',
		format: x => /^[a-zA-Z áéíóúÁÉÍÓÚñÑ]{3,25}$/.test(x)? false :
		{
			es: 'debe tener entre 2 y 25 caracteres, sin simbolos',
			en: 'must has between 2 y 25 caracters, without symbols'
		}
	},
	last_name: {
		type: 'string',
		format: x => /^[a-zA-Z áéíóúÁÉÍÓÚñÑ]{3,25}$/.test(x)? false :
		{
			es: 'debe tener entre 2 y 25 caracteres, sin simbolos',
			en: 'must has between 2 y 25 caracters, without symbols'
		}
	},
	username: {
		type: 'string',
		format: x => /^[a-zA-Z0-9]{3,25}$/.test(x)? false :
		{
			es: 'debe tener entre 2 y 25 caracteres, sin simbolos ni espacios',
			en: 'must has between 2 y 25 caracters, without symbols or spaces'
		}
	},
	pass: {
		type: 'string',
		format: x => /[a-zA-Z0-9]{8,25}/.test(x)? false :
		{
			es: 'debe tener entre 8 y 20 caracteres, solo letras y numeros',
			en: 'must has between 8 y 20 caracters, only letters and numbers'
		}
	},
	prefer_currency: {
		type: 'string',
		format: x => /(usd|eur|ars)/.test(String(x).toLowerCase())? false :
		{
			es: 'use "usd" o "eur" o "ars" ',
			en: 'use "usd" or "eur" or "ars" '
		}
	},
	prefer_top: {
		type: 'number',
		format: x => x<0 && x<=25? false :
		{
			es: 'elegir un valor entre 1 y 25',
			en: 'chose a value between 1 and 25'
		}
	},
}
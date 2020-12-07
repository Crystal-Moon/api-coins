
# Documentacion

---

## Generalidades

 - El servidor espera un token del tipo `Bearer` en las cabeceras bajo el atributo `authorization` (excepto en _/index_). El token tienen una validez de 3hs. Ejemplo

```
  'authorization': 'Bearer eyhhj25dfwevv45645...'
```

 - EL servidor entrega un formato de respuesta estandar segun codigo de respuesta. Por ejemplo:

<table>
	<thead>
		<tr>
			<th>2xx</th><th>4xx</th><th>5xx</th>
		</tr>
	</thead>
	<tbody>
	  <tr>
		<td>
<pre>
{
  success: true,
  status_code: 200,
  payload_type: 'object',
  payload: { ... },
  error: null
}
</pre>
		</td>
		<td>
<pre>
{
  success: true,
  status_code: 400,
  payload_type: 'object',
  payload: null,
  error: {
    code: 'SOME_CODE',
    message: 'some message'
  }
}
</pre>

</td>
			<td>

<pre>
{
  success: false,
  status_code: 500,
  payload_type: 'object',
  payload: null,
  error: {
    code: 'MAYDAY',
    message: 's.o.s'
  }
}
</pre>

</td>
		</tr>
	</tbody>
</table>

 - El campo `payload_type` puede tener los valores `'object'` o `'array'`, indicando asi si el `payload` sera un simple objeto o un array de objetos.

---------

## Rutas

### Sumario

 - **/index**
     - [![post](https://img.shields.io/badge/-POST-blueviolet) /index**/create**](#index_create)
     - [![post](https://img.shields.io/badge/-POST-blueviolet) /index**/login**](#index_login)
 - **/coins**
     - [![get](https://img.shields.io/badge/-GET-1C91D4) /coins](#coins)
 - **/users**
     - [![put](https://img.shields.io/badge/-PUT-6F9021) /users](#user_put)
     - [![post](https://img.shields.io/badge/-POST-blueviolet) /users**/coins**](#user_add)
     - [![get](https://img.shields.io/badge/-GET-1C91D4) /users**/coins**](#user_get)
     - [![delete](https://img.shields.io/badge/-DELETE-red) /users**/coins**](#user_delete)

--------

### Index

<div id="index_create"></div>
![post](https://img.shields.io/badge/-POST-blueviolet) /index**/create**

 Crea un usuario. Retornará el token para interactuar con la api además del perfil de usuario.   
 :pencil2: **Campos del body**    
 - `name`: Nombre del usuario. No se permiten numeros ni simbolos.  
 - `last_name`: Apellido del usuario. No se permiten numeros ni simbolos.   
 - `username`: Servirá para iniciar secion. Solo letras y/o numeros.   
 - `pass`: Contraseña. Solo letras y/o numeros. Entre 8 y 25 caracteres.   
 - `prefer_currency`: Moneda predeterminada para ver los datos. Valores posibles: `usd`, `ars`, o `eur` Por defecto es `'usd'`. Puede ser cambiado luego usando ![put](https://img.shields.io/badge/-PUT-6F9021) _/users_   
 - `prefer_top`: Cantidad de criptomonedas a buscar para un viztazo rápido. Puede ser un valor entre 1 y 25. Por defecto será 10. Puede ser cambiado luego usando ![put](https://img.shields.io/badge/-PUT-6F9021) _/users_   
 - `lang`: Idioma del usuario. Valores posibles: `es` o `en`. Por defecto es `es`.   

 Ejemplo de respuesta:

```javascript
{
  success: true,
  status_code: 201,
  payload_type: 'object',
  payload: {
    auth: {
      token: 'eyvnri3463khjwhdv...',
      expire_at: 1607300450705
	},
	profile: {
	   name: 'Cosme',
	   last_name: 'Fulanito',
	   username: 'Cosme777',
	   prefer_currency: 'ars',
	   prefer_top: 10
	}
  },
  error: null
}
```

------

<div id="index_login"></div>
![post](https://img.shields.io/badge/-POST-blueviolet) /index**/login**

 Inicia sesion.    
 :pencil2: **Campos del body**   
 - `username`: Nombre de usuario elejido al registrarse.    
 - `pass`: Contraseña.      

 Ejemplo de respuesta:

```javascript
{
  success: true,
  status_code: 200,
  payload_type: 'object',
  payload: {
    auth: {
      token: 'eyvnri3463khjwhdv...',
      expire_at: 1607300450705
	},
	profile: {
	   name: 'Cosme',
	   last_name: 'Fulanito',
	   username: 'Cosme777',
	   prefer_currency: 'ars',
	   prefer_top: 10
	}
  },
  error: null
}
```

-------

_A partir de aqui el token en cabecera es obligatorio_

-------

### Coins

<div id="coins"></div>
![get](https://img.shields.io/badge/-GET-1C91D4) /coins

 Retorna las criptomonedas disponibles en CoinGecko.    
 :pencil2: **Parámetros**    
 - `limit`: Cantidad máxima de resultados a retornar. Se toma 10 por default.    
 - `page`: La página de resultados que se desea visualizar. Se toma 1 por default.    

 Ejemplo de respuesta:

```javascript
{
  success: true,
  status_code: 200,
  payload_type: 'array',
  payload: [
    {
      id: 'bitcoin-cash',
      name: 'Bitcoin Cash',
      symbol: 'bch',
      image: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png?1594689492',
      price: 284.72,
      last_updated: '2020-12-07T01:50:17.591Z',
      currency: 'usd'
    },
    {
       // ... more results
    }
  ],
  error: null
}
```

-------

### Users

<div id="user_put"></div>
![put](https://img.shields.io/badge/-PUT-6F9021) /users

 Edita un usuario. Solo se puede editar el `prefer_currency` y el `prefer_top`.    
 :pencil2: **Campos del body**    
 - `prefer_currency`: Moneda preferida para ver los datos. Valores posibles: `usd`, `ars`, `eur`.   
 - `prefer_top`: Cantidad por defecto para consultar las monedas preferidas. Se toma 10 por defecto.    

 Ejemplo de respuesta:

```javascript
{
  success: true,
  status_code: 204,
  payload_type: 'object',
  payload: {},
  error: null
}
```

--------

<div id="user_add"></div>
![post](https://img.shields.io/badge/-POST-blueviolet) /users**/coins**

 Agrega una criptomoneda para hacerle seguimiento. Usar un id válido, provisto por ![get](https://img.shields.io/badge/-GET-1C91D4) _/coins_, de lo contrario retornará un error 4xx.    
 :pencil2: **Campos del body**    
 - `id`: Id de la criptomoneda.   

 Ejemplo de respuesta:

```javascript
{
  success: true,
  status_code: 201,
  payload_type: 'object',
  payload: {
    id: 'tether',
    name: 'Tether',
    symbol: 'usdt',
    image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707'
  },
  error: null
}
```
---------

<div id="user_get"></div>
![get](https://img.shields.io/badge/-GET-1C91D4) /users**/coins**

 Retorna un resumen de las criptomonedas que sigue el usuario. Si no tiene ninguna retornará un error de codigo 4xx.   
 :pencil2: **Parámetros**    
 - `top`: La cantidad de monedas a retornar. Si se omite se asume el `prefer_top` del usuario.  
 - `order`: Como se ordenarán los resultados segun precio. Valores posibles: `'asc'` y `'desc'`. `'desc'` por defecto.   

 Ejemplo de respuesta:

```javascript
{
  success: true,
  status_code: 200,
  payload_type: 'array',
  payload: [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      usd: 19274.54,      
      ars: 1573406,
      eur: 15894,
      last_updated_at: 1607305147
    },
    {
      // ... more results
    }
  ],
  error: null
}
```

---------

<div id="user_delete"></div>
![delete](https://img.shields.io/badge/-DELETE-red) /users**/coins/{id}**

 Elimina el seguimiento a una moneda.       
 :pencil2: **Parámetros**    
 - `id`: Id de la criptomoneda.  

 Ejemplo de respuesta:

```javascript
{
  success: true,
  status_code: 204,
  payload_type: 'object',
  payload:{},
  error: null
}
```

-------
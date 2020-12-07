CREATE DATABASE api_criptos;
USE api_criptos;

CREATE TABLE users (
  `id` int(11) not null auto_increment,
  `name` varchar(25) not null,
  `last_name` varchar(25) not null,
  `username` varchar(25) not null unique,
  `pass` varchar(200) not null,
  `prefer_currency` varchar(3) default 'usd',
  `prefer_top` int(2) default 25,
  `lang` varchar(2) default 'es',
  `register_date` datetime default current_timestamp,
  PRIMARY KEY (`id`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE users_coins (
  `id` int(11) not null auto_increment,
  `id_user` int(11) not null,
  `id_coin` varchar(25) not null,
  `name` varchar(25) default '',
  `image` varchar(500) default '',
  `symbol` varchar(10) default '',
  `register_date` datetime default current_timestamp,
  `is_erase` boolean default false,
  PRIMARY KEY (`id`),
  INDEX(`id_user`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
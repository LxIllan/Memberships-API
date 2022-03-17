# Membership Management backend

## Technologías
<ul>
    <li>NodeJS</li>
    <li>Express</li>
    <li>Auth jwt</li>
    <li>MongoDB</li>
</ul>

## Descripción
Es una REST API que administra membresías. Cuenta con do tipos de
usuarios: recepcionistas y administradores. El Sistema controla quién
hace ventas, registrar miembros, etc. Las mambresías pueden tener
restricciones de horarios. Es posible enviar notificaciones a los
miembros, se les notifica cuando su membresía está a unos días de
terminar y se les puede enviar avisos generales. Este Sistema fue
diseñado para un gimnaso, pero además puede ser utilizado por
entrenadores personales y quién sea que necesite administrar
membresías de clientes.

## Instalación
```
npm install
```
## Environment variables
<ul>
    <li>MONGO_URI - mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/?authSource=admin</li>
    <li>JWT_SECRET_KEY - E.g. wdnkw21498i3902ionweqvrnu</li>
    <li>CLIENT_URL - E.g. http://192.168.1.1:3000</li>
    <li>EMAIL_ADDRESS - E.g. mailer@gmail.com</li>    
    <li>EMAIL_PASSWORD - E.g. yourPassword1</li>
    <li>EMAIL_PORT - E.g. 587</li>
    <li>EMAIL_HOST - E.g. smtp.gmail.com</li>
</ul>
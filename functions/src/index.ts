import * as functions from 'firebase-functions';

import * as express from 'express';
import * as cors from 'cors';


import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://portafolio-c2229.firebaseio.com"
});

const db = admin.firestore();


 export const helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.json("Hola desde mi nuevo proyecto");
 });


 export const getWorks = functions.https.onRequest( async(req, res)=>{

        //capturar la referencia de mi base de datos
        const worksRef = db.collection('works');
        // Capturar los objetos actuales en mi referencia
        const worksSnap = await worksRef.get();
        //traer los dattos mi objetos
        const works = worksSnap.docs.map(doc => doc.data);

        res.json( works );
 });

export const getLevel = functions.https.onRequest( async(req, res)=>{
    const levelRef = db.collection('skills');
    const levelSnap = await levelRef.get();
    const level = levelSnap.docs.map(doc=>doc.data);

    res.json(level);
});        


 const app = express();
 const nodemailer = require("nodemailer");
 app.use( cors({origin : true}) );

 app.use(express.urlencoded({ extended:false }));

 app.use(express.json());
 
 app.get('/works', async(req, res)=>{

    const worksRef = db.collection('works');
    const worksSnap = await worksRef.get();
    const works = worksSnap.docs.map( doc=>doc.data() );

    res.json( works );
 });

 app.get('/works/:id', async(req, res)=>{

    const projectId = req.params.id;
    const workRef = db.collection('works').doc(projectId);
    const workSnap = await workRef.get();
    const work =  workSnap.data();

		if(workSnap.exists){
            res.json(work);
        }else{
            res.json({
              
                ok : 'false',
                mensaje : 'No existe el proyecto'
            });
            console.log("Error");
        }
   
 });
 app.get('/levels', async(req, res)=>{
    const levelRef = db.collection('skills');
    const levelSnap = await levelRef.get();
    const level = levelSnap.docs.map(doc=>doc.data());

    res.json(level);
});

app.post('/send-email', async(req, res)=>{
    const {name, email, phone, message} = req.body;

    const contentHTML =  ` 
            <h1>Información de Contacto</h1>
            <ul>
                <li>Nombre: ${name}</li>
                <li>Email: ${email}</li>
                <li>Telefono: ${phone}</li>
               
            </ul>
            <br>
            <p>Mensaje: ${message}</p>
    ` ;

    const transporter = nodemailer.createTransport({
        host: "mail.beconection.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'testmail@beconection.com', // generated ethereal user
          pass: 'contraseña' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      });

   const info = await transporter.sendMail({
          from: "'Calitriqui Server' <testmail@beconection.com>",
          to:'pandaresocesar@gmail.com',
          subject:"Formulario de Portafolio",
          html: contentHTML
      });
      console.log("Mensaje Enviado", info.messageId);
    res.json('recibido');
});


 export const api = functions.https.onRequest( app );
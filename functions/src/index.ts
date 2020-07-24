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

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
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

        


 const app = express();

 app.use( cors({origin : true}) );

 
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

 export const api = functions.https.onRequest( app );
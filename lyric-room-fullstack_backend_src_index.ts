import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA_JSON || '{}'))
});

const app = express();
app.use(bodyParser.json());

async function verifyIdToken(req:any, res:any, next:any){
  const token = req.headers.authorization?.split('Bearer ')[1];
  if(!token) return res.status(401).send('unauth');
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch(e) {
    res.status(401).send('unauth');
  }
}

app.get('/api/admin/users', verifyIdToken, async (req,res) => {
  res.json({ users:[{id:'1',username:'admin',email:'admin@test.com',verified:true,isAdmin:true}] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Backend running on', PORT));

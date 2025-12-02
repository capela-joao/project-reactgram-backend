import mongoose from 'mongoose';

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log('Conectou ao banco!');

    return dbConn;
  } catch (err: any) {
    console.log('Erro ao conectar', err);
  }
};

conn();

export default conn;

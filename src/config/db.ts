import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Conectou ao banco!');
  } catch (err: any) {
    console.log('Erro ao conectar', err);
    process.exit(1);
  }
};

import mongoose, { Document, Model } from 'mongoose';
import AuthService from '@src/services/auth';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
/**
 * Validates the email and throws a validation error, otherwise it will throw a 500
 */
schema.path('email').validate(async (email: string) => {
  const emailCount = await mongoose.models.User.countDocuments({ email });
  return !emailCount;
}, 'already exists in the database.');

schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    console.error(`Error hashing the password for the user ${this.name}`, err);
  }
});

export const User: Model<UserModel> = mongoose.model('User', schema);

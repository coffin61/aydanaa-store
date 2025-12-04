// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool from '../../../lib/db'; // اتصال به MySQL

// تابع گرفتن کاربر از دیتابیس
async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
}

// تنظیمات احراز هویت
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'ایمیل', type: 'text' },
        password: { label: 'رمز عبور', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // پیدا کردن کاربر در دیتابیس
        const user = await getUserByEmail(email);
        if (!user) {
          throw new Error('کاربری با این ایمیل یافت نشد');
        }

        // بررسی رمز عبور
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('رمز عبور اشتباه است');
        }

        // برگرداندن اطلاعات کاربر
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // اگر session.user وجود نداشت، اول بسازیمش
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // مسیر صفحه لاگین
  },
  secret: process.env.NEXTAUTH_SECRET, // اضافه کردن secret برای جلوگیری از خطا
};

// خروجی اصلی برای NextAuth
export default NextAuth(authOptions);
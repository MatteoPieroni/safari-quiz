import { login } from './login';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <h1>Sign in</h1>
      <form action={login} className={styles.form}>
        <div>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required />
          </label>
        </div>
        <button>Log in</button>
      </form>
    </main>
  );
}

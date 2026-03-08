import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile | My App',
  description: 'User profile page',
};

export default async function ProfilePage() {
  let user = null;
  try {
    user = await getMe();
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Username:</strong> {user?.username || 'Guest'}
          </p>

          <p>
            <strong>Email:</strong> {user?.email || 'N/A'}
          </p>
        </div>
      </div>
    </main>
  );
}

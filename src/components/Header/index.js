import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Notifications from '~/components/Notifications';

import logo from '~/assets/log-purple.svg';
import { Container, Content, Profile } from './styles';

function Header() {
  const profile = useSelector((state) => state.user.profile);
  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="goBarber" />
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>{profile.name}</strong>
              <Link to="/profile">Meu perfil</Link>
            </div>
            <img
              src={
                profile.avatar.url ||
                'https://api.adorable.io/avatars/50/abott@adorable.png'
              }
              alt={profile.name}
            />
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}

export default Header;

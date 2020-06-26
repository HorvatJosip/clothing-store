import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: 70%;
  margin: 0 0 25px 0;
`;

export const LogoContainer = styled(Link)`
  width: 70px;
  height: 100%;
  padding: 25px;
`;

export const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 50%;
  height: 100%;
`;

export const OptionLink = styled(Link)`
  padding: 10px 15px;
  cursor: pointer;
`;

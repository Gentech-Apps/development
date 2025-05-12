import React from 'react';
import { GOOGLE_MAPS_SEARCH_QUERY } from '../../../constants/maps';
import ExploreIcon from '@material-ui/icons/Explore';
import { styles } from '../styles';

const GoogleMap = ({ process }) => {
  const createQuery = () => {
    const { address, city } = process.proccess;
    const fullAddress = city + ' ' + address;
    const query = GOOGLE_MAPS_SEARCH_QUERY + fullAddress.split(' ').join('+');
    return query;
  };
  return (
    <a href={createQuery()} target="blank">
      <ExploreIcon style={styles.styledShowAttachmentsIconMobile} />
    </a>
  );
};

export default GoogleMap;

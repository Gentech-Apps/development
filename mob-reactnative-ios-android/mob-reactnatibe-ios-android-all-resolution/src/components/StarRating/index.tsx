import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from '../../globalStyles';

const StarRating = ({ rating, onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState(rating);

  const handleStarPress = (newRating) => {
    setSelectedRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <View style={styles.starRatingContainer}>
      {[1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity key={index} onPress={() => handleStarPress(index)} activeOpacity={0.7}>
          <Icon
            name={index <= selectedRating ? 'star' : 'star'}
            size={40}
            color={index <= selectedRating ? 'gold' : globalStyles.placeholderText.color}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
});

export default StarRating;

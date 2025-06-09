import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { globalStyles } from '../../globalStyles';
import { actions as menuActions } from '../../redux/foodMenu/foodMenuSlice';
import { actions as weeklyActions } from '../../redux/weeklyMenu/weeklyMenuSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const DropdownComponent = () => {
  const [value, setValue] = useState<any>(null);
  const dispatch = useAppDispatch();

  const foodMenuCatData = useAppSelector((state) => state.foodMenuReducer.foodMenuCatData);

  const setSelectedValue = (categoryId: number) => {
    setValue(categoryId);
    dispatch(
      weeklyActions.updateSuggestionRequest({
        name: 'categoryId',
        value: categoryId,
        form: 'saveSuggestionReq',
      }),
    );
  };
  useEffect(() => {
    dispatch(menuActions.getAllMenusViaCategory());
  }, []);

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      itemTextStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={foodMenuCatData}
      search
      maxHeight={300}
      labelField="categoryName"
      valueField="categoryId"
      placeholder="Select Category"
      searchPlaceholder="Search..."
      value={value}
      onChange={(item) => {
        setSelectedValue(item.categoryId);
      }}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 55,
    borderBottomColor: globalStyles.placeholderText.color,
    borderBottomWidth: 0.5,
    width: '100%',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#080808',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#080808',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

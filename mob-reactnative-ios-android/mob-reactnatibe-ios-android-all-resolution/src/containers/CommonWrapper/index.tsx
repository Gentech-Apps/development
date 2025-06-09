import React, { Fragment } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import { globalStyles } from '../../globalStyles';

interface CommonWrapperProps {
  loading: boolean;
  onInit?: () => void;
  disableScrollView?: false;
  children: any;
  viewHeight?: true;
}

const CommonWrapper: React.FC<CommonWrapperProps> = ({
  loading,
  onInit,
  disableScrollView,
  children,
  viewHeight,
}) => {
  const height = viewHeight ? '90%' : '100%';
  return (
    <Fragment>
      {loading && <LoadingScreen />}
      <SafeAreaView style={[styles.safeAreaContainer, { height: height }]}>
        <StatusBar backgroundColor={'#000000'} />
        {!disableScrollView ? (
          <ScrollView
            style={styles.scrollViewContainer}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                colors={[globalStyles.primary.color]}
                refreshing={loading}
                onRefresh={onInit}
              />
            }
          >
            {children}
          </ScrollView>
        ) : (
          <Fragment>{children}</Fragment>
        )}
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: globalStyles.secondary.color,
  },
  scrollViewContainer: { flex: 1, backgroundColor: globalStyles.secondary.color },
});

export default CommonWrapper;

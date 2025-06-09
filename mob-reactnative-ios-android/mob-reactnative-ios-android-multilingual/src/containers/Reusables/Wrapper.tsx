import React, { Fragment } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useTheme } from '../../ThemeProvider';
import { globalStyles } from '../../globalStyles';

const Wrapper = ({
  children,
  loading,
  onInit,
  disableScrollView = false,
}: {
  children?:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal;
  loading?: boolean;
  onInit?: () => void;
  disableScrollView?: boolean;
}) => {
  const { theme }: any = useTheme();

  return (
    <SafeAreaView style={[theme.container, { height: '100%' }]}>
      <StatusBar backgroundColor={globalStyles.primary.color} />
      {!disableScrollView ? (
        <ScrollView
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
          style={theme.container}
        >
          {children}
        </ScrollView>
      ) : (
        <Fragment>{children}</Fragment>
      )}
    </SafeAreaView>
  );
};

export default Wrapper;

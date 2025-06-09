# Vendor

This is a mobile app for food vendors in our company. It provides a suite of features, including order management, transaction tracking, and food menu access. 

#### Vendors can use :

- Accept or reject incoming orders
- View daily order reports
- Manage transactions
- Order food supplies from suppliers

This app simplifies and streamlines food vendor operations, helping them to provide a better customer experience.

# 🎨 Color Guide

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primary Color | ![#94bf3c](https://via.placeholder.com/10/94bf3c?text=+) #94bf3c |
| Secondary Color | ![#ffffff](https://via.placeholder.com/10/ffffff?text=+) #ffffff |
| Status Bar Color | ![#a3a3a3](https://via.placeholder.com/10/a3a3a3?text=+) #a3a3a3 |
| Primary Text Color | ![#6d7275](https://via.placeholder.com/10/6d7275?text=+) #6d7275 |


# ⚙️ Setting Up and Getting Started with the App 🚀

Let's pull from GitLab, and then:

- To begin, execute the following command:

```bash
npm install
```

- Add android SDK path in android/local.properties file

```bash
sdk.dir = C:\\Users\\{{SystemName}}\\AppData\\Local\\Android\\Sdk
```

- For iOS, Go to the project and run below commands

```bash
cd ios
pod install
```
via `pod install` success, You'll get `xcworkspace` file in ios folder near `xcodeproj`

- To execute the project (on Windows):

```bash
npm run start
```

- To execute the project (on Mac):

  - Launch Xcode and select `Open an Existing Project`.
  - Navigate to the `ios` folder and choose the `xcworkspace` file for import.
  - Once the project is loaded, click the `Run` button located in the top-left corner of Xcode to initiate the build process. This action will open and run the app on the iOS emulator device.

**NOTE:** As we have integrated Prettier for code formatting, do not be alarmed if you see lots of changes in files that you have not updated. Just relax and check some files and push if you have your changes. Basically, Prettier formats all the files, which is why it just added files to the change list of Git.

Once the Metro bundler is running, follow these instructions on the terminal:

For Android:
- Press `a` for an Android device (ensure that you have started the AVD or Android emulator from Android Studio).
- The Metro bundler will compile your code and create a build.
- It will then install the APK and run the project on the emulator.

For iOS:
- Once the project is loaded in Xcode, click the `Run` button located in the top-left corner of Xcode to initiate.
- The above process will open multiple terminals with Metro. Press `i` in the terminal to continue.
- The Metro bundler will compile your code and create a iOS build.
- It will install the APK and run the project on the emulator.

# 🛠️ Handy Commands

- To install all dependencies when initiating the project locally:

```bash
npm install
```

- To format code:

```bash
npm run pretty:fix
```

- To clean the Android Gradle build, run the following command whenever you make any changes to files within the Android folder:

```bash
cd android
./gradlew clean
```

- To clean and create an Android build, follow the commands below. (If you encounter any errors during execution, please resolve them before proceeding to the next step):

```bash
npm run android:init
cd android
./gradlew assembleDebug
```
You will get `.apk` file at `android\app\build\outputs\apk\debug` location.

- To clean/create an Android build, follow the commands below. (If you encounter any errors during execution, please resolve them before proceeding to the next step):

```bash
npm run android:build
```

- To clean/create an iOS build, follow the commands below. (If you encounter any errors during execution, please resolve them before proceeding to the next step):

```bash
npm run ios:build
```


# 🗂️ Directory Hierarchy

Below is an overview of the Project Folder Structure, which may not remain the same in the future:

```bash
ReactNative-iOSAndroidMultiLangual
├── .husky/
|   └── pre-commit    # Will run commands at `git commit`
├── android/
├── ios/
├── src/
|   ├── assets/
│   |   ├── images/
|   |   └── fonts/
|   ├── containers/
|   |   ├── FoodMenu/
|   |   |   ├── components/
|   |   |   |   └── [components].tsx     # child components of FoodMenu
|   |   |   ├── redux/
|   |   |   |   ├── initialState.ts
|   |   |   |   ├── interface.ts
|   |   |   |   ├── saga.ts
|   |   |   |   └── slice.ts
|   |   |   ├── Foodmenu.tsx
|   |   |   └── styles.ts
|   |   ├── Reusables/
|   |   |   ├── Loader.tsx
|   |   |   ├── LoaderWithText.tsx
|   |   |   ├── Wrapper.tsx
|   |   |   └── [Component.tsx]     # Reusable components
|   ├── navigations/    # All navigation related components
|   |   ├── components/
|   |   |   └── Header.tsx
|   |   ├── redux/
|   |   |   ├── initialState.ts
|   |   |   ├── interface.ts
|   |   |   └── slice.ts
|   |   └── BottomNavigation.tsx
|   ├── store/   # All core files of Redux/Saga
|   |   ├── store.ts
|   |   ├── rootState.ts
|   |   ├── initialState.ts
|   |   ├── rootSaga.ts
|   |   └── hooks.ts
|   ├── utils/
|   |   ├── apis/
|   |   |   └── requests.ts     # Common functions that are used to make requests using fetch
|   |   └── helpers/
|   |       └── [helpers.ts]     # File will contains all reusable/common functions
|   ├── App.tsx     # First components
|   ├── AppProvider.tsx   # First components to start App
|   ├── globalStyles.ts     # Global style which will remain common for all the screens/containers
|   ├── ThemeProvider.tsx   # ThemeProvide contains configurations of App theme
├── package.json     # dependencies file
├── app.json    # Static config file
├── README.md   # Please update README.md file always whenever you apply any architecture level changes in App
├── tsconfig.json
├── metro.config.js
├── Gemfile
├── babel.config.js
├── .watchmanconfig
├── .gitignore
├── .eslintrc.js
├── .prettierrc.js     # Prettier to format code
└── index.js     # First file of Project
```

- **Wrapper.tsx** 👉 The Wrapper component contains common code for all the containers that may be required. When you create a new bottom tab navigation/container, you must use the `<Wrapper></Wrapper>` tags. The Wrapper component accepts three important props: `{children, loading, onInit, disableScrollView = false}`
    - **children -** Automatically captures the code between your `<Wrapper></Wrapper>` tags.
    - **loading -** Represents the loading state of the specific component.
    - **onInit -** Specifies the name of the function/method that you want to call when the component renders.
    - **disableScrollView -** If you encounter a VirtualList/FlatList error due to conflicts with a ScrollView in a Wrapper component, you can resolve it by using this solution and passing the 'disableScrollView' parameter as 'true'.

For example:
```javascript
const YourComponent = () => {
  const {loading} = useAppSelector(state => state.componentstate);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallBack(() => {
      onInit();
    }, []);
  );

  const onInit = () => {
    dispatch(fetchList());
  };

  return (
    <Wrapper loading={loading} onInit={onInit}>
      <View>
        <Text>YourComponent</Text>
      </View>
    </Wrapper>
  );
};

export default YourComponent;
```

# 🤔 How to Begin and Set Up a New Container:

Follow the imports to understand the connections between components, Redux, and styles. If the terminal shows no errors but you're stuck, use the instructions below to debug efficiently.

- Create a separate folder for the container (You can follow the folder structure from other containers).
- Do not forget to wrap your component with `<Wrapper></Wrapper>`, which will provide you with some additional functionality.
- Add your container to the bottom navigation bar to view.
- Create initial state and an interface and add both within the `RootInitialState` and `RootState`, respectively.
- Create a slice and saga (follow the same approach from other containers) and add them within the `store` and `rootSaga`, respectively.

🎉 Now you can customize your container as per your needs.

# 🚀 GitLab Best Practices

- Pull the Development 1.0 Branch
- Create a New Branch Based on Development 1.0. When creating a new branch, name it to reflect the specific implementation you're working on, followed by today's date in a concise format. `For example: 'api-integration-food-menu-20230918'`
- Commit and Push Your Code to GitLab
- Submit a Pull Request (PR) to Merge into Development 1.0, Ensure that the name of your branch matches the PR name.
- Provide a Detailed Description in the PR:
 - What you have accomplished.
 - A list of the functionalities you have implemented.
 - Any challenges or issues you encountered during implementation.
 - References to external sources, such as documentation or articles that helped you.
 - Important considerations for the merging process or future maintenance.

**NOTE:** As we have integrated Prettier for code formatting, do not be alarmed if you see lots of changes in files that you have not updated. Just relax and check some files and push if you have your changes. Basically, Prettier formats all the files, which is why it just added files to the change list of Git.

🔎 These steps will be helpful for tracking and managing development tasks and will make easier to address any issues related to functionality in the future.


# 🛠️ Troubleshooting Guide: Common Errors and Solutions

### 🔍 SDK Location Not Found

For Android: 
**❌ ERROR:** 
```bash
FAILURE: Build failed with an exception.

* What went wrong:
Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'.
> Could not determine the dependencies of null.
   > SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in 
your project's local properties file at 'C:android\local.properties'.
```

**💡 SOLUTION:**

Add android SDK path in `android/local.properties` file

```bash
sdk.dir=C:\\Users\\{{SystemName}}\\AppData\\Local\\Android\\Sdk
```

For iOS:
**❌ ERROR:** 
```bash
checking whether the C compiler works... no
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: unable to lookup item 'Path' in SDK 'iphoneos'
/Users/xxx/Library/Caches/CocoaPods/Pods/External/glog/2263bd123499e5b93b5efe24871be317-1f3da/missing: Unknown `--is-lightweight' option
Try `/Users/xxx/Library/Caches/CocoaPods/Pods/External/glog/2263bd123499e5b93b5efe24871be317-1f3da/missing --help' for more information
configure: WARNING: 'missing' script is too old or missing
configure: error: in `/Users/xxx/Library/Caches/CocoaPods/Pods/External/glog/2263bd123499e5b93b5efe24871be317-1f3da':
configure: error: C compiler cannot create executables
See `config.log' for more details
```

**💡 SOLUTION:**

- Install Xcode App
- Verify Xcode installed on Mac or not via `xcode-select` on terminal
- Go to the project directory, then ios folder to run following command:

```bash
pod install
```

If success, You'll get `xcworkspace` file in ios folder near `xcodeproj`


### 4️⃣0️⃣4️⃣ No such file or directory

**❌ ERROR:** 
```bash
info Writing bundle output to:, android/app/src/main/assets/index.android.bundle
error ENOENT: no such file or directory, 'index.android.bundle'.
Error: ENOENT: no such file or directory, open 'index.android.bundle'
husky - pre-commit hook exited with code 1 (error)
```

**💡 SOLUTION:**

You need to create a assets folder at following path and run command again:

```bash
root\\android\\app\\src\\main\\
```


### 📃 VirtualizedLists should never be nested inside plain ScrollViews

**❌ ERROR:** 
```bash
ERROR  VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.
```

**💡 SOLUTION:**

You have to pass disableScrollView={true} in the Wrapper component if you are using it. This resolves the error because it disables the default ScrollView behavior in the Wrapper component, preventing conflicts with nested VirtualizedLists. For example:

```javascript
<Wrapper loading={loading} onInit={onInit} disableScrollView={true}>
  //Your code here...
</Wrapper>
```

### 4️⃣0️⃣4️⃣ Not Found `gradle-build`

**❌ ERROR:** 
```bash
A problem occurred evaluating project ':app'.
> Could not read script '/home/suresh/Desktop/Demo/application/node_modules/@react-native/gradle-plugin' as it is a direc
```
OR
```bash
Included build node_modules/@react-native/gradle-plugin does not exists
```

**💡 SOLUTION:**

- If you weren't encountering this error before, it's possible that you may have inadvertently removed the 'node_modules,' 'yarn.lock,' and 'package-lock.json' files from your project before running `npm install`.
- If you followed the steps mentioned above, take a look at the `node_modules/@react-native` folder – you'll notice that the 'gradle-build' folder is missing, which is likely the reason for the error you're encountering.
- To resolve this issue, simply restore the 'yarn.lock' and 'package-lock.json' files, and then run `npm install`. This should resolve the error you're facing.
- If you want to verify that everything is working correctly, you can run the following commands:

```bash
cd android
./gradlew clean
```

**NOTE:** 
- When resetting or performing a clean npm installation, please refrain from deleting the yarn.lock and package-lock.json files; you should only delete the node_modules folder.
- If you decide to delete any files, make sure to keep a backup of both yarn.lock and package-lock.json as a precaution.


### 4️⃣0️⃣4️⃣ Not Found `zsh: command not found: gradlew` ON iOS

**❌ ERROR:** 
```bash
zsh: command not found: gradlew
```

**💡 SOLUTION:**

- Run following commands:
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

### 4️⃣0️⃣4️⃣ Not Found `undefined method deprecator' for ActiveSupport:Module (NoMethodError)` ON iOS

**❌ ERROR:** 
```bash
<class:Array>': undefined method `deprecator' for ActiveSupport:Module (NoMethodError)

  deprecate to_default_s: :to_s, deprecator: ActiveSupport.deprecator
                                                          ^^^^^^^^^^^
Did you mean?  deprecate_constant
```

**💡 SOLUTION:**

- ActiveSupport is the gem dependency in iOS. Run the following commands to check the ActiveSupport version:
```bash
gem list --local

//in the list you'll find
activesupport (7.1.1, 7.0.8) //multiple different version in (..)
```
- We have to keep single version only. It needs v7.0.8 others you have to uninstall. Run following commands:
```bash
gem uninstall activesupport

//It'll ask you to select version and that would be uninstall.
```
- Please try again now.


### `[!] Invalid `Podfile` file` for iOS build

**❌ ERROR:** 
```bash
[!] Invalid `Podfile` file: This error occurs because the `react-native/scripts/react_native_pods.rb` module is missing or cannot be resolved. This typically happens when the `node_modules` folder is incomplete or corrupted.

**💡 SOLUTION:**
- Ensure all dependencies are installed by running:

    at Module._resolveFilename (node:internal/modules/cjs/loader:1077:15)
    at Function.resolve (node:internal/modules/cjs/helpers:125:19)
    at [eval]:1:9
    at Script.runInThisContext (node:vm:123:12)
    at Object.runInThisContext (node:vm:299:38)
    at node:internal/process/execution:82:21
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:81:62)
    at evalScript (node:internal/process/execution:103:10)
    at node:internal/main/eval_string:29:3 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/ios/[eval]'
  ]
}

Node.js v18.18.0
```

**💡 SOLUTION:**

- Go to the project folder where you have package & Gemfile. Run following cmds:
```bash
bundle install
```
- Run following cmds:
```bash
cd ios
pod install
cd ..
```
- Now you'll get the xprojectworkspace file in ios/project_name folder.



### INSTALL_FAILED_UPDATE_INCOMPATIBLE

**❌ ERROR:** 
```bash
Unable to install C:....PATH....app-debug.apk
com.android.ddmlib.InstallException: INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com. signatures do not match previously installed version; ignoring!
```

**💡 SOLUTION:**
- Delete previously installed app and clear devices cache for that app.
- Run cmd again.
**💡 SOLUTION:**
- Delete the previously installed app and clear the device's cache for that app. This step ensures that any residual data or conflicting signatures from the old version are removed, preventing installation issues.
- Run the command again.

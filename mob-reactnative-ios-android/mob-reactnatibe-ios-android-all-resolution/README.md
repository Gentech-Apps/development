# User

The Canteen provides a suite of features, including online order, Transaction history of users, Menu suggestion option for users, etc.

#### Users can use the application to:

- Make orders online
- View order reports
- Transaction history
- Menu suggestions
- Feedback on every food item

The application simplifies and streamlines food order operations.

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

- For iOS, navigate to the project directory and run the following commands

```bash
cd ios
pod install
```
After successfully running `pod install`, you will find the `_user.xcworkspace` file in the iOS folder near `sanxgenie_user.xcodeproj`.

- To execute the project (on Windows):

```bash
npm run start
```

- To execute the project (on Mac):

  - Launch Xcode and select `Open an Existing Project`.
  - Navigate to the `ios` folder and choose the `_user.xcworkspace` file for import.
  - Once the project is loaded, click the `Run` button located in the top-left corner of Xcode to initiate the build process. This action will open and run the app on the iOS emulator device.

**NOTE:** As we have integrated Prettier for code formatting, do not be alarmed if you see lots of changes in files that you have not updated. Just relax and check some files and push if you have your changes. Basically, Prettier formats all the files, which is why it just added files to the change list of Git.

Once the Metro bundler is running, follow these instructions on the terminal:

For Android:
- Press `a` for an Android device (ensure that you have started the AVD or Android emulator from Android Studio).
- The Metro bundler will compile your code and create a build.
- It will then install the APK and run the project on the emulator.

For iOS:
- Once the project is loaded in Xcode, click the `Run` button located in the top-left corner of Xcode to initiate.
- This process will open multiple terminals with Metro. In one of the terminals, press `i` to proceed.
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

- To create an Android build, follow the commands below. (If you encounter any errors during execution, please resolve them before proceeding to the next command):

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


# 🤔 How to Begin and Set Up a New Container:

In general, you can follow the imports to understand the connectivity between the parent and child components, Redux for every container, separate and global styles, and via filename too. But when you get stuck, and the terminal says that there is no error in your code, then following instructions will help you debug the code more efficiently.

- Create a separate folder for the container (You can follow the folder structure from other containers).
- Do not forget to wrap your component with `<CommonWrapper></CommonWrapper>`, which will provide you with some additional functionality.
- Add your container to the bottom navigation bar to view.
- Create initial state and an interface and add both within the `RootInitialState` and `RootState`, respectively.
- Create a slice and saga (follow the same approach from other containers) and add them within the `store` and `rootSaga`, respectively.

🎉 Now you can customize your container as per your needs.

# 🚀 GitLab Best Practices

- Pull the Development 1.0 Branch
- Create a New Branch Based on Development 1.0, When creating a new branch, name it to reflect the specific implementation you're working on, followed by today's date in ISO format (YYYY-MM-DD). `For example: 'API Integration for Food Menu Page - 2023-09-18'`
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
your project's local properties file at 'C:\Users\LAPGEN-42\Work\React Native Apps\snexgeni_user\android\local.properties'.
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

If success, You'll get `.xcworkspace` file in ios folder near `sanxgenie.xcodeproj`


### 4️⃣0️⃣4️⃣ No such file or directory

**❌ ERROR:** 
```bash
info Writing bundle output to:, android/app/src/main/assets/index.android.bundle
error ENOENT: no such file or directory, open 'C:\Projects\SnaXGinie_User\snexgeni_user\android\app\src\main\assets\index.android.bundle'.
Error: ENOENT: no such file or directory, open 'C:\Projects\SnaXGinie_User\snexgeni_user\android\app\src\main\assets\index.android.bundle'
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

You have to pass disableScrollView={true} in Wrapper component If you are using, For example:

```javascript
<Wrapper loading={loading} onInit={onInit} disableScrollView={true}>
  //Your code here...
</Wrapper>
```

### 4️⃣0️⃣4️⃣ Not Found `gradle-build`

**❌ ERROR:** 
```bash
A problem occurred evaluating project ':app'.
> Could not read script '/home/suresh/Desktop/Demo/application/node_modules/@react-native/gradle-plugin' as it is a directory and not a file.
```
OR
```bash
Included build node_modules/@react-native/gradle-plugin does not exists
```

**💡 SOLUTION:**

- If you weren't encountering this error before, you may have accidentally deleted 'node_modules,' 'yarn.lock,' or 'package-lock.json' before running `npm install`.
- If you followed the steps mentioned above, take a look at the `node_modules/@react-native` folder – you'll notice that the 'gradle-build' folder is missing, which is likely the reason for the error you're encountering.
- To resolve this issue, simply restore the 'yarn.lock' and 'package-lock.json' files, and then run `npm install`. This should resolve the error you're facing.
- If you want to verify that everything is working correctly, you can run the following commands:

```bash
cd android
./gradlew clean
```

**NOTE:** 
- When resetting or performing a clean npm installation, please refrain from deleting the yarn.lock and package-lock.json files; you should only delete the node_modules folder. If both yarn.lock and package-lock.json exist, prioritize yarn.lock and use Yarn for dependency management.
- If you decide to delete any files, make sure to keep a backup of both yarn.lock and package-lock.json as a precaution.

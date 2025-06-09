# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

doFirst {  }
doLast {
def moveFunc = { resSuffix →
File originalDir = file("buildDir/generated/res/react/release/drawable-{resSuffix}");
if (originalDir.exists()) {
File destDir = file("buildDir/../src/main/res/drawable-{resSuffix}");
ant.move(file: originalDir, tofile: destDir);
}
}
moveFunc.curry(“ldpi”).call()
moveFunc.curry(“mdpi”).call()
moveFunc.curry(“hdpi”).call()
moveFunc.curry(“xhdpi”).call()
moveFunc.curry(“xxhdpi”).call()
moveFunc.curry(“xxxhdpi”).call()
}
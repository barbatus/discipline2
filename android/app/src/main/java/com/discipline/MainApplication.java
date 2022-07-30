package com.discipline;

import com.bugsnag.android.Bugsnag;
import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactlibrary.RNThreadPackage;
import co.apptailor.Worker.BaseReactPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import io.realm.react.RealmReactPackage;
import com.clipsub.RNShake.RNShakeEventPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.horcrux.svg.SvgPackage;
import com.clipsub.RNShake.RNShakeEventPackage;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import dog.craftz.sqlite_2.RNSqlite2Package;
import io.realm.react.RealmReactPackage;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      return packages.addAll(
          Arrays.<ReactPackage>asList(
            BugsnagReactNative.getPackage(),
            new ReactNativePushNotificationPackage(),
            new RNThreadPackage(),
            new BaseReactPackage(),
            new RNNotificationsPackage(),
            new RealmReactPackage(),
            new RNShakeEventPackage(),
            new RNBackgroundFetchPackage(),
            new SvgPackage(),
            new RNShakeEventPackage(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNBackgroundGeolocation(),
            new RNBackgroundGeolocation(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNBackgroundGeolocation(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNBackgroundGeolocation(),
            new RNBackgroundGeolocation(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNBackgroundGeolocation(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNBackgroundGeolocation(),
            new RNSqlite2Package(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNBackgroundGeolocation(),
            new RNBackgroundGeolocation(),
            new RNSqlite2Package(),
            new RealmReactPackage(),
            new RNShakeEventPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new RNBackgroundGeolocation(),
            new MapsPackage()
        )
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Bugsnag.start(this);
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.rndiffapp.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}

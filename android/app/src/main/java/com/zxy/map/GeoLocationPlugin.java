package com.zxy.map;

import android.app.Activity;
import android.util.Log;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import pub.devrel.easypermissions.AfterPermissionGranted;
import pub.devrel.easypermissions.EasyPermissions;


@CapacitorPlugin(name = "GeoLocation")
public class GeoLocationPlugin extends Plugin implements AMapLocationListener{
    //请求权限码
    private static final int REQUEST_PERMISSIONS = 9527;

    //声明AMapLocationClient类对象
    public AMapLocationClient mLocationClient = null;

    //声明AMapLocationClientOption对象
    public AMapLocationClientOption mLocationOption = null;

    private PluginCall pluginCall;


    @PluginMethod()
    public void getLocation(PluginCall call) throws Exception {
        initLocation();
        requestPermission();
        this.pluginCall = call;
    }


    /**
     * 动态请求权限
     */
    @AfterPermissionGranted(REQUEST_PERMISSIONS)
    public void requestPermission() {
        String[] permissions = {
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.READ_PHONE_STATE",
                "android.permission.WRITE_EXTERNAL_STORAGE",
        };

        if (EasyPermissions.hasPermissions(getContext(), permissions)) {
            //true 有权限 开始定位
            mLocationClient.startLocation();
        } else {
            //false 无权限
            EasyPermissions.requestPermissions((Activity) getContext(), "需要权限", REQUEST_PERMISSIONS, permissions);
        }
    }


    /**
     * 初始化定位
     */
    public void initLocation() {
        //初始化定位
        try {
            mLocationClient = new AMapLocationClient(getContext().getApplicationContext());
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (mLocationClient != null) {
            //设置定位回调监听
            mLocationClient.setLocationListener((AMapLocationListener) this);
            //初始化AMapLocationClientOption对象
            mLocationOption = new AMapLocationClientOption();
            //设置定位模式为AMapLocationMode.Hight_Accuracy，高精度模式。
            mLocationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);
            //获取最近3s内精度最高的一次定位结果：
            //设置setOnceLocationLatest(boolean b)接口为true，启动定位时SDK会返回最近3s内精度最高的一次定位结果。如果设置其为true，setOnceLocation(boolean b)接口也会被设置为true，反之不会，默认为false。
            mLocationOption.setOnceLocationLatest(true);
            //设置是否返回地址信息（默认返回地址信息）
            mLocationOption.setNeedAddress(true);
            //设置定位请求超时时间，单位是毫秒，默认30000毫秒，建议超时时间不要低于8000毫秒。
            mLocationOption.setHttpTimeOut(20000);
            //关闭缓存机制，高精度定位会产生缓存。
            mLocationOption.setLocationCacheEnable(false);
            //给定位客户端对象设置定位参数
            mLocationClient.setLocationOption(mLocationOption);
        }
    }


    /**
     * 接收异步返回的定位结果
     * @param aMapLocation
     */
    @Override
    public void onLocationChanged(AMapLocation aMapLocation) {
        if (aMapLocation != null) {
            if (aMapLocation.getErrorCode() == 0) {
                //地址
                String address = aMapLocation.getAddress();
                double latitude = aMapLocation.getLatitude();
                double longitude = aMapLocation.getLongitude();
                String city = aMapLocation.getCity();

                StringBuffer stringBuffer = new StringBuffer();
                stringBuffer.append("纬度：" + latitude + "\n");
                stringBuffer.append("经度：" + longitude + "\n");
                stringBuffer.append("地址：" + address + "\n");
                stringBuffer.append("城市：" + city + "\n");
                Log.d("结果", stringBuffer.toString());

                JSObject ret = new JSObject();
                ret.put("city", city);
                ret.put("address", address);
                ret.put("latitude", latitude);
                ret.put("longitude", longitude);
                this.pluginCall.resolve(ret);
                mLocationClient.onDestroy();
            } else {
                //定位失败时，可通过ErrCode（错误码）信息来确定失败的原因，errInfo是错误信息，详见错误码表。
                Log.e("AmapError", "location Error, ErrCode:"
                        + aMapLocation.getErrorCode() + ", errInfo:"
                        + aMapLocation.getErrorInfo());
            }
        }
    }


}

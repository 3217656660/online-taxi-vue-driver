package com.zxy.map;

import androidx.annotation.NonNull;

import com.getcapacitor.BridgeActivity;

import pub.devrel.easypermissions.EasyPermissions;

public class MyBridgeActivity extends BridgeActivity {

    /**
     * 请求权限结果
     *
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

}

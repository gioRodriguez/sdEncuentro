/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.sdencuentro.guia;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;

import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

import android.content.res.AssetManager;
import android.os.Bundle;
import android.util.Log;

public class GuiaEncuentro extends CordovaActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.init();
		
		String content = loadFile();
		
		// Set by <content src="index.html" /> in config.xml
		super.loadUrl(Config.getStartUrl());
		// super.loadUrl("file:///android_asset/www/index.html")
	}

	private String loadFile() {
		AssetManager assetManager = getAssets();
		InputStream inputStream = null;
		try {
			String[] files = assetManager.list("www/texts/Abril");
			inputStream = assetManager.open("www/texts/Abril/Abril23.bh");
			GZIPInputStream zis = new GZIPInputStream(new BufferedInputStream(inputStream));
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			byte[] buffer = new byte[1024];
            int len;
            while((len = zis.read(buffer)) != -1){
            	baos.write(buffer, 0, len);
            }
            //close resources
            zis.close();
            baos.close();
            return new String(baos.toByteArray(), "UTF-8");
		} catch (IOException e) {
			Log.e("message: ", e.getMessage());
		}
		return "";
	}
}

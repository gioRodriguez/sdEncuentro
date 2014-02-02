package com.sdencuentro.guia.plugins;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.zip.GZIPInputStream;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.res.AssetManager;
import android.util.Log;

public class GetTextPlugin extends CordovaPlugin {
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		if(args == null || args.length() == 0){
			Log.e("TextsPlugin", "Null date");
			return false;
		}
		
		//2014-Febrero-01
		String dateSelected = args.getString(0);
		String date[] = dateSelected.split("-");
		String month = date[1].toLowerCase();
		int day = Integer.parseInt(date[2]);
		String file = String.format(Locale.ENGLISH, "www/texts/%s/%s%d.gz.js", month, month, day);
		String text = loadFile(file);
		callbackContext.success(text);
		return true;
	}

	private String loadFile(String file) {
		AssetManager assetManager = cordova.getActivity().getAssets();
		InputStream inputStream = null;
		try {
			inputStream = assetManager.open(file);
			GZIPInputStream zis = new GZIPInputStream(new BufferedInputStream(
					inputStream));
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			byte[] buffer = new byte[1024];
			int len;
			while ((len = zis.read(buffer)) != -1) {
				baos.write(buffer, 0, len);
			}
			// close resources
			zis.close();
			baos.close();
			return new String(baos.toByteArray(), "UTF-8");
		} catch (IOException e) {
			Log.e("message: ", e.getMessage());
		}
		return "";
	}
}

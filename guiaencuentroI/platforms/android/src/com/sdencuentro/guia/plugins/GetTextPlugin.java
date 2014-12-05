package com.sdencuentro.guia.plugins;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.zip.GZIPInputStream;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.res.AssetManager;
import android.util.Log;

public class GetTextPlugin extends CordovaPlugin {
	private static final int DEFAULT_YEAR = 2014;
	private static final Set<Integer> AVAILABLE_YEARS = new HashSet<Integer>();
	static{
		AVAILABLE_YEARS.add(DEFAULT_YEAR);
		AVAILABLE_YEARS.add(2015);
	}
	
	@Override
	public boolean execute(String action, final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		if(args == null || args.length() == 0){
			Log.e("TextsPlugin", "Null date");
			return false;
		}
		
		cordova.getThreadPool().execute(new Runnable() {
			
			@Override
			public void run() {
				try {
					//2014-Febrero-01
					String dateSelected = args.getString(0);													
					
					String date[] = dateSelected.split("-");
					
					String month = date[1].toLowerCase(Locale.ENGLISH);					
					int day = Integer.parseInt(date[2]);					
					int year = Integer.parseInt(date[0]);
					if(!AVAILABLE_YEARS.contains(year)){
						year = DEFAULT_YEAR;
					}
					
					String file = String.format(Locale.ENGLISH, "www/texts/%s/%s.gz.js", year, month);
					String content = loadFile(file);
					
					String [] texts = content.split("\n");
					String text = "Lo sentimos texto no encontrado";
					for (int line = 0; line < texts.length; line++) {
						if(texts[line].contains(String.format("<h2>%d de", day))){
							text = texts[line];
							break;
						}
					}
					
					callbackContext.success(text);
				} catch (Exception e) {
					Log.e("GetTextPlugin", e.getMessage(), e);
					callbackContext.error("lectura no localizada");
				}
			}
		});
		
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

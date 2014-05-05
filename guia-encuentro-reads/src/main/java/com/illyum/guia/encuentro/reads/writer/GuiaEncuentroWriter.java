package com.illyum.guia.encuentro.reads.writer;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class GuiaEncuentroWriter {

	private static final String OUT_PUT_DIRECTORY = "readsOutput/";

	public void write(
			String fileName, 
			String fileBody
	) throws IOException {
		OutputStreamWriter outputStreamWriter = new OutputStreamWriter(
				new FileOutputStream(OUT_PUT_DIRECTORY + fileName), "UTF-8");
		outputStreamWriter.write(fileBody);
		outputStreamWriter.close();
	}

}

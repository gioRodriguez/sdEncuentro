package com.illyum.guia.encuentro.reads.writer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import com.google.common.io.Files;

public class ReadsWriter {

	private static final String OUT_PUT_DIRECTORY = "readsOutput/";

	public void write(
			String fileName, 
			String fileBody
	) throws IOException {
		File file = new File(OUT_PUT_DIRECTORY + fileName);
		Files.createParentDirs(file);
		OutputStreamWriter outputStreamWriter = new OutputStreamWriter(
				new FileOutputStream(file), "UTF-8");
		outputStreamWriter.write(fileBody);
		outputStreamWriter.close();
	}

}

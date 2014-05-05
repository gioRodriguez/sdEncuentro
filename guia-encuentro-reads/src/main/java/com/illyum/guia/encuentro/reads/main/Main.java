package com.illyum.guia.encuentro.reads.main;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import com.illyum.guia.encuentro.reads.read.GuiaEncuentroRead;
import com.illyum.guia.encuentro.reads.reader.GuiaEncuentroReaderImpl;
import com.illyum.guia.encuentro.reads.writer.GuiaEncuentroWriter;

public class Main {

	public static void main(
			String[] args
	) throws IOException {
		List<String> results = new ArrayList<String>();

		URL folder = Main.class.getClassLoader().getResource("texts");
		File[] months = new File(folder.getPath()).listFiles();

		for (File month : months) {
			File[] reads = month.listFiles();
			for (File read : reads) {
				if (read.isFile()) {
					results.add(read.getPath());
				}
			}
		}
		
		GuiaEncuentroReaderImpl guiaEncuentroReader = new GuiaEncuentroReaderImpl();
		GuiaEncuentroRead guiaEncuentroRead = new GuiaEncuentroRead(guiaEncuentroReader);
		
		
		GuiaEncuentroWriter guiaEncuentroWriter = new GuiaEncuentroWriter();
		for (String file : results) {
			System.out.println(file);
			guiaEncuentroRead.setReadPath(file);
			guiaEncuentroWriter.write(outPutFile(file), guiaEncuentroRead.toHtml());
		}
	}
	
	private static String outPutFile(String inputFile){
		String[] fileParts = inputFile.replace("\\", "/").split("/");		
		return fileParts[fileParts.length - 2].toLowerCase() +"/"+ fileParts[fileParts.length - 1].toLowerCase();
	}

}

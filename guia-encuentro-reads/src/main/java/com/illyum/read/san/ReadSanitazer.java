package com.illyum.read.san;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.commons.lang3.text.WordUtils;

public class ReadSanitazer {

	private static final String NEW_LINE = System.getProperty("line.separator");;

	public static void removeEmptyLines(String filePath) throws IOException {
		URL url = ReadSanitazer.class.getClassLoader().getResource(filePath);

		InputStreamReader inputStreamReader = new InputStreamReader(
				new FileInputStream(filePath), "UTF-8");
		BufferedReader br = new BufferedReader(inputStreamReader);
		StringBuilder withoutEmptyLines = new StringBuilder();
		String line = "";
		while ((line = br.readLine()) != null) {
			line = line.replace(NEW_LINE, "").trim();
			if (line.length() > 0) {
				withoutEmptyLines.append(line);
				withoutEmptyLines.append(NEW_LINE);
			}
		}
		br.close();

		String resultFile = filePath.replace(".txt", ".rel");
		OutputStreamWriter outputStreamWriter = new OutputStreamWriter(
				new FileOutputStream(resultFile), "UTF-8");
		outputStreamWriter.write(withoutEmptyLines.toString());
		outputStreamWriter.close();
	}

	public static String loadFile(String path) throws IOException,
			URISyntaxException {
		URL url = ReadSanitazer.class.getClassLoader().getResource(path);
		byte[] encoded = Files.readAllBytes(Paths.get(url.toURI()));
		return StandardCharsets.UTF_8.decode(ByteBuffer.wrap(encoded))
				.toString();
	}

	public static void buildHeader(String filePath) throws IOException {
		URL url = ReadSanitazer.class.getClassLoader().getResource(filePath);

		InputStreamReader inputStreamReader = new InputStreamReader(
				new FileInputStream(filePath), "UTF-8");
		BufferedReader br = new BufferedReader(inputStreamReader);
		StringBuilder buildHeader = new StringBuilder();
		String line = "";
		int headerLine = 0;
		boolean headerConainerEnding = false;
		buildHeader.append("<div class='readHeader'><ul>");
		while ((line = br.readLine()) != null) {
			buildHeader.append(NEW_LINE);
			if (headerLine < 3) {
				buildHeader
						.append("<li><h")
						.append(headerLine + 1)
						.append("><span></span>")
						.append(WordUtils.capitalizeFully(line).replace("lectura", "Lectura"))
						.append("</h")
						.append(headerLine + 1).append("></li>");
				headerLine++;
			} else {
				if (!headerConainerEnding) {
					buildHeader.append("</ul></div><hr><div class='readContent'>");
					buildHeader.append(NEW_LINE);
					headerConainerEnding = true;
				}
				buildHeader.append(line);
			}			
		}		
		buildHeader.append("</div>");
		br.close();

		String resultFile = filePath.replace(".rel", ".bh").toLowerCase();
		OutputStreamWriter outputStreamWriter = new OutputStreamWriter(
				new FileOutputStream(resultFile), "UTF-8");
		outputStreamWriter.write(buildHeader.toString());
		outputStreamWriter.close();
	}

	public static void buildAll(String file) throws IOException {
		removeEmptyLines(file);
		buildHeader(file.replace(".txt", ".rel"));
	}

}

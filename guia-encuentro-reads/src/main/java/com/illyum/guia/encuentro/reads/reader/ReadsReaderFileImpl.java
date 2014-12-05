package com.illyum.guia.encuentro.reads.reader;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import com.google.common.base.Charsets;
import com.google.common.base.Strings;
import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.DailyReading;

public class ReadsReaderFileImpl implements ReadsReader {

	private static final int MIN_HEADER_LENGHT = 3;
	private static final int LINES_TO_USE_AS_HEADER = 3;
	
	@Override
	public DailyReading readLines(
			String filePath
	) throws ReadsNotFounException {		
		File guiaEncuentroFile = new File(filePath);
		if (!guiaEncuentroFile.exists()) {
			throw new ReadsNotFounException();
		}
		
		DailyReading.Builder dailyReading = new DailyReading.Builder();
		
		//List<AbstractLine> guiEncuetroLine = new ArrayList<AbstractLine>();
		try {			
			List<String> guiaEncuentroFileLines = Files.readAllLines(
					guiaEncuentroFile.toPath(), 
					Charsets.UTF_8
			);
			
			List<String> cleanedLines = cleanLines(guiaEncuentroFileLines);
			
			for (String textLine : cleanedLines) {
				
				if(isHeaderLine(cleanedLines.indexOf(textLine))){
					dailyReading.addHeaderWithLevel(textLine, cleanedLines.indexOf(textLine) + 1);
					continue;
				}
				
				dailyReading.addLine(textLine);
			}
		} catch (IOException e) {
			throw new ReadsNotFounException(e.getMessage(), e);
		}
		
		return dailyReading.build();
	}
	
	private List<String> cleanLines(List<String> guiaEncuentroFileLines) {
		List<String> cleanedLines = new ArrayList<String>();
		for (String line : guiaEncuentroFileLines) {
			if (Strings.isNullOrEmpty(line) || 
					"".equals(line.trim()) ||
					line.length() < MIN_HEADER_LENGHT) {
				continue;
			}
			
			cleanedLines.add(line);
		}
		
		return cleanedLines;
	}

	public boolean isHeaderLine(
			int lineIndex
	) {
		return 0 <= lineIndex && lineIndex < LINES_TO_USE_AS_HEADER;
	}
}

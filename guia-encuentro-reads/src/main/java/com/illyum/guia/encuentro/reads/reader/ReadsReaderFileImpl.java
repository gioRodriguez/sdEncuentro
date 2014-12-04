package com.illyum.guia.encuentro.reads.reader;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import com.google.common.base.Charsets;
import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.Line;

public class ReadsReaderFileImpl implements ReadsReader {

	@Override
	public List<Line> readLines(
			String filePath
	) throws ReadsNotFounException {		
		File guiaEncuentroFile = new File(filePath);
		if (!guiaEncuentroFile.exists()) {
			throw new ReadsNotFounException();
		}
		
		List<Line> guiEncuetroLine = new ArrayList<Line>();
		try {			
			List<String> guiaEncuentroFileLines = Files.readAllLines(
					guiaEncuentroFile.toPath(), 
					Charsets.UTF_8
			);
			
			int guiaEncuentroReadLine = 0;
			for (int currentLine = 0; currentLine < guiaEncuentroFileLines.size(); currentLine++) {
				Line guiaEncuentroLine = Line.createLine(
						guiaEncuentroFileLines.get(currentLine), 
						guiaEncuentroReadLine
				);
				
				if(guiaEncuentroLine.isNull()){
					continue;
				}
				
				guiEncuetroLine.add(
						guiaEncuentroLine
				);
				guiaEncuentroReadLine++;
			}
		} catch (IOException e) {
			throw new ReadsNotFounException(e.getMessage(), e);
		}
		
		return guiEncuetroLine;
	}
}
